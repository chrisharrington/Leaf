var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var repositories = require("../../data/repositories");

var sut = require("../../authentication/project");

describe("project", function() {
	describe("call", function() {
		it("should add 'getProject' method to request", function() {
			var request = {}, response = {}, next = function() {};
			sut(request, response, next);
			assert(request.getProject);
		});

		it("should call 'next'", function() {
			var request = {}, response = {}, next = sinon.stub();
			sut(request, response, next);
			assert(next.calledOnce);
		});
	});

	describe("getProject", function() {
		var _stubs;

		it("should get 'Leaf' project with localhost host", function() {
			return _run({
				host: "localhost"
			}).then(function() {
				assert(_stubs.one.calledWith({ formattedName: "leaf" }));
			});
		});

		it("should get project using name derived from the first section of the host", function() {
			return _run({
				host: "blah.boo.com"
			}).then(function() {
				assert(_stubs.one.calledWith({ formattedName: "blah" }));
			});
		});

		it("should get project using lowercase first section of host", function() {
			return _run({
				host: "BLAH.boo.com"
			}).then(function() {
				assert(_stubs.one.calledWith({ formattedName: "blah" }));
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.one = sinon.stub(repositories.Project, "one").resolves({});

			var request = params.request || { host: params.host || "blah.boo.com" };
			var response = params.response || {};
			var next = params.next || function() {};

			sut(request, response, next);

			return request.getProject();
		}
	});
});