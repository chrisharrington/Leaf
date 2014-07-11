var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/statusRepository");

describe("statusRepository", function() {
	describe("construction", function() {
		it("should set Status model for base repository", function() {
			assert(sut.model == models.Status);
		});
	});
});