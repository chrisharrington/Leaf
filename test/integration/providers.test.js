var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var sut = require("../../integration/providers");

describe("providers", function() {
	describe("call", function() {
		it("should return github provider with 'github'", function() {
			assert.equal(sut("github"), require("../../integration/providers/github"));
		});
	});
});