var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	repositories = require("../../data/repositories");
require("../setup");
var emailer = require("../../email/emailer");

var sut = require("../../email/notificationEmailer");

describe("notificationEmailer", function() {
	describe("issueAssigned", function() {
		var _send;

		beforeEach(function() {
			_send = sinon.stub(emailer, "send").resolves();
		});

		it("should call send with the issued assigned email template", function() {
			return _run().then(function() {
				assert(_send.calledWith("./templates/issueAssigned.html"));
			});
		});

		it("should call send with given user", function() {
			var user = "the user";
			return _run({
				user: user
			}).then(function() {
				assert(_send.calledWith(sinon.match.any, {
					user: user,
					issue: sinon.match.any,
					formattedProjectName: sinon.match.any
				}));
			});
		});

		it("should call send with given issue", function() {
			var issue = { number: 10, project: { name: "the project name" } };
			return _run({
				issue: issue
			}).then(function() {
				assert(_send.calledWith(sinon.match.any, {
					user: sinon.match.any,
					issue: issue,
					formattedProjectName: sinon.match.any
				}));
			});
		});

		it("should call send with given project name", function() {
			var issue = { number: 10, project: { name: "the project name" } };
			return _run({
				issue: issue
			}).then(function() {
				assert(_send.calledWith(sinon.match.any, {
					user: sinon.match.any,
					issue: sinon.match.any,
					formattedProjectName: issue.project.name.formatForUrl()
				}));
			});
		});

		it("should call send with the user's email address", function() {
			var user = { emailAddress: "the email address" };
			return _run({
				user: user
			}).then(function() {
				assert(_send.calledWith(sinon.match.any, sinon.match.any, user.emailAddress));
			});
		});

		it("should call send with the 'Leaf - Issue Assigned'", function() {
			return _run().then(function() {
				assert(_send.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, "Leaf - Issue Assigned"));
			});
		});

		afterEach(function() {
			_send.restore();
		});

		function _run(params) {
			params = params || {};
			return sut.issueAssigned(params.user || "the user", params.issue || { project: { name: params.projectName || "the project name" }});
		}
	});
});