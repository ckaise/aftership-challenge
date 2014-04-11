"use strict";

var should = require('should'),
	 _ = require('underscore'),
	Courier = require('../lib/index');

describe('Test: .is', function() {

	describe("Track @ usps('1ZXF68280392966078')", function() {
		it('Expect return true', function() {
			var result = Courier.usps('1ZXF68280392966078');
			result.should.eql('1ZXF68280392966078');
		});
	});

	describe("Track @ hkpost('RA105803262HK')", function() {
		it('Expect return true', function() {
			var result = Courier.hkpost('RA105803262HK');
			result.should.eql('RA105803262HK');
		});
	});

	describe("Track @ dpduk('8K105803262HK')", function() {
		it('Expect return true', function() {
			var result = Courier.dpduk('8K105803262HK');
			result.should.eql('8K105803262HK');
		});
	});
});