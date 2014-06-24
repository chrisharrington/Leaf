require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var bundler = Promise.promisifyAll(require("../../bundling/bundler"));
var less = Promise.promisifyAll(require("less"));
var minifier = Promise.promisifyAll(require("yuicompressor"));
var assets = require("../../bundling/assets");

var sut = require("../../controllers/style");

describe("style", function() {
	describe("get /style", function() {
//		it("should set get /style route", function() {
//			var app = { get: sinon.stub(), post: sinon.stub() };
//			sut(app);
//			assert(app.get.calledWith("/style", sinon.match.func));
//		});
//
//		it("should send 200", function() {
//			return _run({
//				assert: function(result) {
//					assert(result.response.send.calledWith(sinon.match.any, 200));
//				}
//			});
//		});
//
//		it("should concatenate files as read from assets", function() {
//			return _run({
//				assert: function(result) {
//					assert(result.stubs.bundler.calledWith(["first", "second"]));
//				}
//			});
//		});
//
//		it("should lessify concatenated string", function() {
//			return _run({
//				assert: function(result) {
//					assert(result.stubs.less.calledWith("the concatenated string"));
//				}
//			});
//		});
//
//		it("should minify lessified css when in production environment", function() {
//			return _run({
//				env: "production",
//				assert: function(result) {
//					assert(result.stubs.minifier.calledWith("the lessified string", { type: "css" }));
//				}
//			});
//		});
//
//		it("should not minify lessified css when in development environment", function() {
//			return _run({
//				env: "development",
//				assert: function(result) {
//					assert(result.stubs.minifier.notCalled);
//				}
//			});
//		});
//
//		it("should set content type header to text/css", function() {
//			return _run({
//				assert: function(result) {
//					assert(result.response.header.calledWith("Content-Type", "text/css"));
//				}
//			});
//		});
//
//		it("should set cache control header to 'public, maxAge=2592000000' in production", function() {
//			return _run({
//				env: "production",
//				assert: function(result) {
//					assert(result.response.header.calledWith("Cache-Control", "public, max-age=2592000000"));
//				}
//			});
//		});
//
//		it("should set cache control header to 'private, no-cache, max-age=0' in development", function() {
//			return _run({
//				env: "development",
//				assert: function(result) {
//					assert(result.response.header.calledWith("Cache-Control", "private, no-cache, max-age=0"));
//				}
//			});
//		});
//
//		it("should send 500 on error", function() {
//			return base.testRoute({
//				sut: sut,
//				verb: "get",
//				route: "/style",
//				stubs: {
//					assets: sinon.stub(assets, "styles").returns(["first", "second"]),
//					bundler: sinon.stub(bundler, "concatenate").rejects(new Error("oh noes!")),
//					less: sinon.stub(less, "renderAsync").resolves("the lessified string"),
//					minifier: sinon.stub(minifier, "compressAsync").resolves("the compressed string")
//				},
//				assert: function(results) {
//					assert(results.response.send.calledWith(sinon.match.string, 500));
//				}
//			});
//		});

		it("should not render style on the second call when in production environment", function() {
			var stubs = {
				bundler: sinon.stub(bundler, "concatenate").resolves("the concatenated string"),
				assets: sinon.stub(assets, "styles").returns(["first", "second"]),
				less: sinon.stub(less, "renderAsync").resolves("the lessified string"),
				minifier: sinon.stub(minifier, "compressAsync").resolves("the compressed string")
			};

			var request = {}, response = {
				header: sinon.stub(),
				send: sinon.stub()
			}, get = sinon.stub();
			get.withArgs("env").returns("production");
			sut({ get: get });

			var func = get.firstCall.args[1];
			return func(request, response).then(function() {
				return func(request, response);
			}).finally(function() {
				assert(stubs.bundler.calledOnce);
				for (var name in stubs)
					stubs[name].restore();
			});
		});

//		it("should render style on the second call when in development environment", function() {
//			var stubs = {
//				bundler: sinon.stub(bundler, "concatenate").resolves("the concatenated string"),
//				assets: sinon.stub(assets, "styles").returns(["first", "second"]),
//				less: sinon.stub(less, "renderAsync").resolves("the lessified string"),
//				minifier: sinon.stub(minifier, "compressAsync").resolves("the compressed string")
//			};
//			return base.testRoute({
//				sut: sut,
//				verb: "get",
//				route: "/style",
//				env: "development",
//				assert: function() {
//					return base.testRoute({
//						sut: sut,
//						verb: "get",
//						route: "/style",
//						env: "development",
//						assert: function() {
//							assert(stubs.bundler.calledTwice);
//							for (var name in stubs)
//								stubs[name].restore();
//						}
//					});
//				}
//			});
//		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/style",
				env: params.env,
				stubs: {
					assets: sinon.stub(assets, "styles").returns(["first", "second"]),
					bundler: sinon.stub(bundler, "concatenate").resolves("the concatenated string"),
					less: sinon.stub(less, "renderAsync").resolves("the lessified string"),
					minifier: sinon.stub(minifier, "compressAsync").resolves("the compressed string")
				},
				assert: params.assert
			});
		}
	});
});