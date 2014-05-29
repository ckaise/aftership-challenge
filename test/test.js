var should = require('should'),
	_ = require('underscore'),
	Courier = require('../lib/index');

describe('Test: .is', function() {

	// Courier: http://www.usps.com
	// Hints: You can apply the API from their web site
	// Time need: less than an hour if you have the api key

	describe('Track @ usps(\'9405903699300184125060\')', function() {

		var usps = {
			checkpoints: [
				{
					country_name: '',
					message: 'Delivered',
					checkpoint_time: '2014-05-16T12:00:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.usps('9405903699300184125060');
			result.should.eql(usps);
		});
	});

	// Courier: http://www.hongkongpost.com/
	// Hints: There is no official API from hongkongpost, but you may use web or other method to get the result easily.
	// Time need: less than an hour if you find the correct way

	describe('Track @ hkpost(\'CP889331175HK\')', function() {

		var hkpost = {
			checkpoints: [
				{
					country_name: 'HK',
					message: 'Item posted.',
					checkpoint_time: '2013-12-11T00:00:00'
				},
				{
					country_name: 'HK',
					message: 'In transit.',
					checkpoint_time: '2013-12-12T00:00:00'
				},
				{
					country_name: 'HK',
					message: 'Processed for departure.',
					checkpoint_time: '2013-12-13T00:00:00'
				},
				{
					country_name: 'HK',
					message: 'The item left Hong Kong for its destination on  19-Dec-2013 ',
					checkpoint_time: '2013-12-17T00:00:00'
				},
				{
					country_name: 'NZ',
					message: 'Arrived.',
					checkpoint_time: '2014-01-14T00:00:00'
				},
				{
					country_name: 'NZ',
					message: 'In transit.',
					checkpoint_time: '2014-01-15T00:00:00'
				},
				{
					country_name: 'NZ',
					message: 'Delivered.',
					checkpoint_time: '2014-01-16T00:00:00'
				}
			]
		};

		it('Expect return true', function() {
			var result = Courier.hkpost('CP889331175HK');
			result.should.eql(hkpost);
		});
	});

	describe('Track @ dpduk(\'15502370264989N\')', function() {
		// Courier: http://www.dpd.co.uk
		// Hints: Not that easy, if you can't find the magic in the cookies
		// Time need: We spent two days to dig out the magic. Once you know it, can be done within 2 hours.

		var dpduk = {'checkpoints': [
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'We have your parcel, and it\'s on its way to your nearest depot',
				checkpoint_time: '2014-01-08T22:33:50'
			},
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'We have your parcel, and it\'s on its way to your nearest depot',
				checkpoint_time: '2014-01-08T22:34:58'
			},
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'Your parcel has left the United Kingdom and is on its way to Saudi Arabia',
				checkpoint_time: '2014-01-09T03:56:57'
			},
			{
				country_name: 'United Kingdom',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-09T22:34:00'
			},
			{
				country_name: 'Bahrain',
				message: 'Your parcel has arrived at the local delivery depot',
				checkpoint_time: '2014-01-10T09:39:00'
			},
			{
				country_name: 'Bahrain',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-10T13:45:00'
			},
			{
				country_name: 'Bahrain',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-12T13:17:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel has arrived at the local delivery depot',
				checkpoint_time: '2014-01-14T06:30:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel is at the local depot awaiting collection',
				checkpoint_time: '2014-01-14T21:18:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel is on the vehicle for delivery',
				checkpoint_time: '2014-01-15T08:34:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'The parcel has been delivered, signed for by BILAL',
				checkpoint_time: '2014-01-15T19:23:00'
			}
		]
		};

		it('Expect return true', function() {
			var result = Courier.dpduk('15502370264989N');
			result.should.eql(dpduk);
		});
	});
});
