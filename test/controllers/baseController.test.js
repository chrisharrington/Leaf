var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var fs = Promise.promisifyAll(require("fs"));
var base = require("../base");

var sut = require("../../controllers/baseController");

describe("baseController", function() {
	describe("view", function() {
		var _stubs;

		it("should read file at given location", function() {
			var location = "the location";
			return _run({
				location: location
			}).then(function() {
				assert(_stubs.readFile.calledWith(location));
			});
		});

		it("should send html as read from the given file", function() {
			var html = "the read html";
			return _run({
				html: html
			}).then(function() {
				assert(_stubs.send.calledWith(html, sinon.match.any));
			});
		});

		it("should send 200", function() {
			var html = "the read html";
			return _run({
				html: html
			}).then(function() {
				assert(_stubs.send.calledWith(sinon.match.any, 200));
			});
		});

		it("should send 500 on error", function() {
			return _run({
				readFile: sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!"))
			}).then(function() {
				assert(_stubs.send.calledWith(sinon.match.any, 500));
			});
		});

		afterEach(function() {
			base.restoreStubs(_stubs);
		});

		function _run(params) {
			params = params || {};
			_stubs = {};
			_stubs.readFile = params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html);
			return sut.view(params.location || "the location", params.response || {
				send: _stubs.send = sinon.stub()
			});
		}
	});
});