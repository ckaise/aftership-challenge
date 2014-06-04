var Q = require('q');
var request = Q.denodeify(require('request'));
var cheerio = require('cheerio');
var moment = require('moment');
var _ = require('underscore');

(function() {
    function Courier() {
        /**
         * Get latest status of tracking from USPS official api
         * ref: https://www.usps.com/business/web-tools-apis/track-and-confirm.pdf
         * @param  {String} tracking_number
         * @return {promise}				{ checkpoints: [{...}] }
         */
        this.usps = function(tracking_number) {
            var username = "279ABC005823";
            var url = 'http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackFieldRequest%20USERID="' + username + '"><TrackID%20ID="' + tracking_number + '"></TrackID></TrackFieldRequest>';

            var promise = request({
                url: url,
                method: 'GET'
            });

            return promise
                .then(function(result) {
                    var response = result[0];
                    var body = result[1];

                    checkStatusCode(response.statusCode);

                    $ = cheerio.load(body, {
                        xmlMode: true
                    });

                    checkUspsXmlError($);

                    return buildUsps($);
                });

        };

        /**
         * Get latest status of tracking by web scraping
         * @param  {String} tracking_number
         * @return {Promise}                 { checkpoints: [{...}] }
         */
        this.hkpost = function(tracking_number) {
            var url = "http://app3.hongkongpost.hk/CGI/mt/e_detail.jsp?mail_type=parcel_inw&tracknbr=" + tracking_number + "&localno=" + tracking_number;

            var promise = request({
                url: url,
                method: 'GET'
            });

            return promise
                .then(function(result) {
                    var response = result[0];
                    var body = result[1];

                    checkStatusCode(response.statusCode);

                    $ = cheerio.load(body, {
                        xmlMode: true
                    });

                    checkHkpostHtmlError($)

                    return buildHkpost($);
                });
        };

        /**
         * Get latest status of tracking by 2 step
         * 1. fire Get request with tracking number to get searchSession which is used as cookie in next step
         * 2. fire Get request with tracking number and cookie to get json result
         * @param  {String} tracking_number
         * @return {Promise}                 { checkpoints: [{...}] }
         */
        this.dpduk = function(tracking_number) {
            var url = "http://www.dpd.co.uk/esgServer/shipping/shipment/_/parcel/?filter=id&searchCriteria=deliveryReference%3D" + tracking_number;

            var promise = request({
                url: url,
                method: 'GET'
            });

            return promise
                .then(function(result) {
                    var response = result[0];
                    var body = result[1];

                    checkStatusCode(response.statusCode);

                    body = JSON.parse(body);

                    checkDpdukError(body);

                    return request({
                        url: "http://www.dpd.co.uk/esgServer/shipping/delivery/?parcelCode=" + tracking_number,
                        method: 'GET',
                        headers: {
                            cookie: 'tracking=' + body.obj.searchSession
                        }
                    });
                })
                .then(function(result) {
                    var response = result[0];
                    var body = result[1];

                    checkStatusCode(response.statusCode);

                    body = JSON.parse(body);

                    checkDpdukError(body);

                    return buildDpduk(body);
                })


        };

        /**
         * parse XML and build checkpoint object
         * @param  {Object} $ 	a jQuery like object which has parsed XML
         * @return {Object}      {
         *         					checkpoints:[{
         *         						country_name: "",
         *         						message: "",
         *         						checkpoint_time: ""
         *         					}]
         *         				 }
         */
        var buildUsps = function($) {
            var usps = {};
            usps.checkpoints = [];
            var checkpoint = {};
            var datetime;

            datetime = $('TrackSummary EventTime').html() + " " + $('TrackSummary EventDate').html();

            checkpoint.message = $('TrackSummary Event').html();
            checkpoint.country_name = $('TrackSummary EventCountry').html();
            checkpoint.checkpoint_time = moment(datetime, 'h:mm a MMMM DD, YYYY').format('YYYY-MM-DDTHH:mm:ss');

            usps.checkpoints.push(checkpoint);

            return usps;
        };

        /**
         * throw exception if the parsed XML return <Error>
         * @param  {Object} $ a jQuery like object which has parsed XML
         * @return
         */
        var checkUspsXmlError = function($) {
            if ($('Error').length > 0) {
                throw "USPS api return Error XML: " + $.html();
            }
        };

        /**
         * Grep data from html table and build checkpoint object
         * @param  {Object} $ a jQuery like object which has parsed hkpost HTML
         * @return {Object}   {
         *         					checkpoints:[{
         *         						country_name: "",
         *         						message: "",
         *         						checkpoint_time: ""
         *         					}]
         *         				 }
         */
        var buildHkpost = function($) {
            var hkpost = {};
            hkpost.checkpoints = [];

            $('table.detail').last().find('tr').each(function(i) {
                if (i != 0) {
                    var checkpoint = {};

                    checkpoint.country_name = _.map(
                        $('td', this).eq(1).text().split(" "),
                        function(s) {
                            return s.charAt(0);
                        }
                    ).join("");
                    checkpoint.message = $('td', this).eq(2).text();
                    checkpoint.checkpoint_time = moment($('td', this).eq(0).text().trim(), 'DD-MMM-YYYY').format('YYYY-MM-DDTHH:mm:ss');
                    hkpost.checkpoints.push(checkpoint);
                }
            });

            return hkpost;
        };

        /**
         * throw exception if the page redirect to enquiry.jsp
         * @param  {Object} $ a jQuery like object which has parsed HTML
         * @return
         */
        var checkHkpostHtmlError = function($) {
            if ($('input#tracknbr').length == 1) {
                throw "HKpost return Error";
            }
        };

        /**
         * Build the checkpoints by digesting json object from dpduk
         * @param  {Object} body json object by dpduk
         * @return {Object}      {
         *         					checkpoints:[{
         *         						country_name: "",
         *         						message: "",
         *         						checkpoint_time: ""
         *         					}]
         *         				 }
         */
        var buildDpduk = function(body) {
            var dpduk = {};
            dpduk.checkpoints = [];

            _.each(body.obj.trackingEvent, function(obj) {
                var checkpoint = {};
                checkpoint.country_name = obj.trackingEventLocation;
                checkpoint.message = obj.trackingEventStatus;
                checkpoint.checkpoint_time = moment(obj.trackingEventDate, 'YYYY-MM-DDTHH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm:ss');
                dpduk.checkpoints.push(checkpoint);
            });

            dpduk.checkpoints.reverse();
            return dpduk;
        }

        /**
         * throw exception if the object.error is not null
         * @param  {Object} body  json object by dpduk
         * @return
         */
        var checkDpdukError = function(body) {
            if (body.error != null) {
                throw "DPDUK return Error";
            }
        }

        /**
         * throw exception if return error code eg. 404, 500
         * @param  {String} statusCode 	return code
         * @return
         */
        var checkStatusCode = function(statusCode) {
            if (statusCode >= 400) {
                throw "Server Error: " + statusCode;
            }
        }
    }

    module.exports = new Courier();
}());
