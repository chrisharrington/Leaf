var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/issueTypeRepository");

describe("issueTypeRepository", function() {
	describe("construction", function() {
		it("should set IssueType model for base repository", function() {
			assert(sut.model == models.IssueType);
		});
	});
});