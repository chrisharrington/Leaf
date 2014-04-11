var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/issueFileRepository");

describe("issueFileRepository", function() {
	describe("construction", function() {
		it("should set IssueFile model for base repository", function() {
			assert(sut.model == models.IssueFile);
		});
	});
});