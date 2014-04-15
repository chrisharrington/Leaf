var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

describe("number", function() {
	describe("toSizeString", function() {
		it("should return bytes string", function () {
			assert((500).toSizeString() == "500 b");
		});

		it("should return kilobytes string", function () {
			assert((1500).toSizeString() == "1.50 kb");
		});

		it("should return megabytes string", function () {
			assert((1500000).toSizeString() == "1.50 mb");
		});
	});
});