var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("user mapping", function() {
	describe("user --> user-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/user");
		});

		it("should define user/user-view-model map", function () {
			assert(_define.calledWith("user", "user-view-model", {
				"id": "_id",
				name: "name",
				emailAddress: "emailAddress",
				emailNotificationForIssueAssigned: "emailNotificationForIssueAssigned",
				emailNotificationForIssueUpdated: "emailNotificationForIssueUpdated",
				emailNotificationForIssueDeleted: "emailNotificationForIssueDeleted",
				emailNotificationForNewCommentForAssignedIssue: "emailNotificationForNewCommentForAssignedIssue"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/user.js"] = null;
		});
	});

	describe("user-view-model --> user", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/user");
		});

		it("should define user-view-model/user map", function () {
			assert(_define.calledWith("user-view-model", "user", {
				"_id": "id",
				name: "name",
				emailAddress: "emailAddress"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/user.js"] = null;
		});
	});

	describe("user --> user-summary-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/user");
		});

		it("should define user-summary/user-summary-view-model map", function () {
			assert(_define.calledWith("user", "user-summary-view-model", {
				"id": "_id",
				name: "name",
				emailAddress: "emailAddress",
				isActivated: sinon.match.func
			}));
		});

		it("should map isActivated to false when activationToken exists", function() {
			var func = _define.thirdCall.args[2].isActivated, token = "the token";
			assert(!func({ activationToken: token }));
		});

		it("should map isActivated to true when activationToken doesn't exist", function() {
			var func = _define.thirdCall.args[2].isActivated;
			assert(func({ activationToken: null }));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/user.js"] = null;
		});
	});
});
