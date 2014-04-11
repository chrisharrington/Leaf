var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/userRepository");

describe("userRepository", function() {
	describe("construction", function() {
		it("should set User model for base repository", function() {
			assert(sut.model == models.User);
		});
	});
});