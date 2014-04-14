var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	repositories = require("../../data/repositories");
require("../setup");

var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var config = require("../../config");
var sendgrid = require("sendgrid");

var sut = require("../../email/emailer");

describe("emailer", function() {
	describe("send", function() {
		var _stubs;

		beforeEach(function() {
			_stubs = {};
		});

		it("should read contents of given template file", function() {
			var file = "the file location";
			return _run({
				file: file
			}).then(function() {
				assert(_stubs.readFile.calledWith(file));
			});
		});

		it("should render with html as read from the email template", function() {
			var html = "the read html";
			return _run({
				html: html
			}).then(function() {
				assert(_stubs.render.calledWith(html, sinon.match.any));
			});
		});

		it("should render with given model", function() {
			var model = "the model to render with html";
			return _run({
				model: model
			}).then(function() {
				assert(_stubs.render.calledWith(sinon.match.any, model));
			});
		});

		it("should send email with from email address as specified in config", function() {
			var fromAddress = "the email address from which the email should be sent";
			return _run({
				fromAddress: fromAddress
			}).then(function() {
				assert(_stubs.send.calledWith({
					to: sinon.match.any,
					from: fromAddress,
					subject: sinon.match.any,
					html: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should read sendgrid username from config", function() {
			return _run().then(function() {
				assert(_stubs.config.calledWith(sinon.match.any, "sendgridUsername"));
			});
		});

		it("should read sendgrid password from config", function() {
			return _run().then(function() {
				assert(_stubs.config.calledWith(sinon.match.any, "sendgridPassword"));
			});
		});

		it("should read from email address from config", function() {
			return _run().then(function() {
				assert(_stubs.config.calledWith(sinon.match.any, "fromAddress"));
			});
		});

		it("should call sendgrid with username and password as read from config", function() {
			var username = "the sendgrid username";
			var password = "the sendgrid password";
			return _run({
				sendgridUsername: username,
				sendgridPassword: password
			}).then(function() {
				assert(_stubs.emailer.calledWith(sinon.match.any, username, password));
			});
		});

		it("should call send with provided single email address", function() {
			var email = "the first email address";
			return _run({
				recipients: email
			}).then(function() {
				assert(_stubs.send.calledWith({
					to: email,
					from: sinon.match.any,
					subject: sinon.match.any,
					html: sinon.match.any
				}));
			});
		});

		it("should call send with provided single email address", function() {
			var first = "the first email address";
			var second = "the second email address";
			var third = "the third email address";
			return _run({
				recipients: [first, second, third]
			}).then(function() {
				assert(_stubs.send.calledWith({ to: first, from: sinon.match.any, subject: sinon.match.any, html: sinon.match.any }));
				assert(_stubs.send.calledWith({ to: second, from: sinon.match.any, subject: sinon.match.any, html: sinon.match.any }));
				assert(_stubs.send.calledWith({ to: third, from: sinon.match.any, subject: sinon.match.any, html: sinon.match.any }));
			});
		});

		it("should call send with from email address as read from config", function() {
			var fromAddress = "the from email address";
			return _run({
				fromAddress: fromAddress
			}).then(function() {
				assert(_stubs.send.calledWith({
					to: sinon.match.any,
					from: fromAddress,
					subject: sinon.match.any,
					html: sinon.match.any
				}));
			});
		});

		it("should call send with subject as given", function() {
			var subject = "the subject";
			return _run({
				subject: subject
			}).then(function() {
				assert(_stubs.send.calledWith({
					to: sinon.match.any,
					from: sinon.match.any,
					subject: subject,
					html: sinon.match.any
				}));
			});
		});

		it("should call send with html as rendered", function() {
			var html = "the rendered html";
			return _run({
				result: html
			}).then(function() {
				assert(_stubs.send.calledWith({
					to: sinon.match.any,
					from: sinon.match.any,
					subject: sinon.match.any,
					html: html
				}));
			});
		});

		it("should fail when send rejects", function() {
			var failed = false;
			return _run({
				error: "oh noes!"
			}).catch(function() {
				failed = true;
			}).finally(function() {
				assert(failed);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.emailer = params.emailer || sinon.stub(sendgrid, "call").returns({ send: _stubs.send = sinon.stub().yields(params.error) });
			_stubs.readFile = params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html || "the read html");
			_stubs.render = params.render || sinon.stub(mustache, "render").returns(params.result);
			_stubs.config = params.config || sinon.stub(config, "call");
			_stubs.config.withArgs(sinon.match.any, "sendgridUsername").returns(params.sendgridUsername || "the sendgrid username");
			_stubs.config.withArgs(sinon.match.any, "sendgridPassword").returns(params.sendgridPassword || "the sendgrid password");
			_stubs.config.withArgs(sinon.match.any, "fromAddress").returns(params.fromAddress || "the from address");
			return sut.send(params.file || "the file", params.model || "the model", params.recipients || ["the recipient"], params.subject || "the subject");
		}
	});
});