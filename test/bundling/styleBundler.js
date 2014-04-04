require("../setup");
var assert = require("assert"), should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var less = Promise.promisifyAll(require("less"));
var bundler = require("../../bundling/bundler");
var minifier = Promise.promisifyAll(require("yuicompressor"));
var sut = require("../../bundling/styleBundler");

describe("styleBundler", function() {
	describe("render", function() {
		beforeEach(function() {
			sinon.stub(bundler, "concatenate").resolves("concatenated");
			sinon.stub(less, "renderAsync").resolves("css");
			sinon.stub(minifier, "compressAsync").resolves(["minified"]);
		});

		it("should return a promise", function() {
			assert(_run().then);
		});

		it("should set get /style route", function() {
			var app = { get: sinon.stub() };
			return _run({
				app: app
			}).then(function() {
				assert(app.get.calledWith("/style", sinon.match.func));
			});
		});

		it("should render appropriate link tag", function() {
			return _run({ timestamp: 12345 }).then(function(result) {
				assert(result.should.equal("<link rel=\"stylesheet\" href=\"/style?v=12345\" type=\"text/css\" />"));
			});
		});

		it("should return minified style on get /style", function() {
			var response = { send: sinon.stub(), header: sinon.stub() };
			var app = { get: function(route, func) {
				if (route == "env")
					return "production";
				if (route == "/style")
					func({}, response, "div.blah { color:red; }");
			} };

			return _run({
				files: ["file1.js", "file2.js"],
				app: app
			}).then(function() {
				assert(response.header.calledWith("Content-Type", "text/css"));
				assert(response.send.calledWith("minified"));
			});
		});

		it("should minify when in production environment", function() {
			return _run({
				env: "production"
			}).then(function(result) {
				assert(minifier.compressAsync.calledOnce);
			});
		});

		afterEach(function() {
			bundler.concatenate.restore();
			less.renderAsync.restore();
			minifier.compressAsync.restore();
		});

		function _run(params) {
			params = params || {};
			return sut.render(params.assets || ["file1.less", "file2.less"], params.app || { get: function() { return params.env || "development"; }}, params.timestamp);
		}
	});
});