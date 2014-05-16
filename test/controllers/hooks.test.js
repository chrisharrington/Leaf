var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var controller = require("../../controllers/baseController");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");
var providers = require("../../integration/providers");

var sut = require("../../controllers/hooks");

describe("hooks", function() {
	describe("post /hook/:provider", function() {
		var _stubs;

		it("should set post /hook/:provider route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/hook/:provider", sinon.match.func));
		});

		it("should call providers with lower case request.params.provider", function() {
			var request = {
				params: {
					provider: "the PROVIDER"
				}
			};
			var provider = {
				handle: sinon.stub().resolves()
			};
			return _run({
				request: request,
				provider: provider
			}).then(function() {
				assert(_stubs.provider.calledWith(sinon.match.any, request.params.provider.toLowerCase()));
			});
		});

		it("should execute handle on provider using provider route parameter", function() {
			var request = {
				params: {
					provider: "the provider"
				}
			};
			var provider = {
				handle: sinon.stub().resolves()
			};
			return _run({
				request: request,
				provider: provider
			}).then(function() {
				assert(provider.handle.calledWith(request))
			});
		});

		it("should send 200", function() {
			var request = {
				params: {
					provider: "the provider"
				}
			};
			var provider = {
				handle: sinon.stub().resolves()
			};
			return _run({
				request: request,
				provider: provider
			}).then(function() {
				assert(_stubs.send.calledWith(200));
			});
		});

		it("should send 500 with error", function() {
			var request = {
				params: {
					provider: "the provider"
				}
			};
			var provider = {
				handle: sinon.stub().rejects(new Error("oh noes!"))
			};
			return _run({
				request: request,
				provider: provider
			}).then(function() {
				assert(_stubs.send.calledWith(sinon.match.any, 500));
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.provider = sinon.stub(providers, "call").returns(params.provider);
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/hook/:provider",
				request: params.request || {},
				response: {
					send: _stubs.send = sinon.stub()
				}
			})
		}
	});
});
