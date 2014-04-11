var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/issueAuditRepository");

describe("issueAuditRepository", function() {
	describe("construction", function() {
		it("should set IssueAudit model for base repository", function() {
			assert(sut.model == models.IssueAudit);
		});
	});
});