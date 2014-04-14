var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	repositories = require("../../data/repositories");
require("../setup");

var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var config = require("../../config");
var sendgrid = require("sendgrid")(config("sendgridUsername"), config("sendgridPassword"));

var sut = require("../../email/notificationEmailer");

describe("notificationEmailer", function() {
	describe("issueAssigned", function() {
		var _stubs;

		beforeEach(function() {
			_stubs = {};
		});

		it("should send email to the email address in the given user", function() {
			var emailAddress = "the receipient's email address";
			return _run({
				emailAddress: emailAddress
			}).then(function() {
				assert(_stubs.send.calledOnce);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			_stubs.readFile = params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html || "the read html");
			_stubs.render = params.render || sinon.stub(mustache, "render").returns(params.result);
			_stubs.send = params.send || sinon.stub(sendgrid, "send");//.yields(params.sendError);
			return sut.issueAssigned(params.user || { emailAddress: "the email address" }, { project: { name: "the project name" }});
		}
	});
});