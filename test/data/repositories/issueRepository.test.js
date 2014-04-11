var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/issueRepository");

describe("issueRepository", function() {
	describe("construction", function() {
		it("should set Issue model for base repository", function() {
			assert(sut.model == models.Issue);
		});
	});
});