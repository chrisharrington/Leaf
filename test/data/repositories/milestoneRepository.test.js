var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/milestoneRepository");

describe("milestoneRepository", function() {
	describe("construction", function() {
		it("should set Milestone model for base repository", function() {
			assert(sut.model == models.Milestone);
		});
	});
});