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
});
