require("../setup");
var assert = require("assert"), should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var minifier = Promise.promisifyAll(require("yuicompressor"));
var bundler = require("../../bundling/bundler");
var sut = require("../../bundling/scriptBundler");

describe("scriptBundler", function() {
	describe("render", function() {
		it("should return promise", function() {
			assert(_run().then);
		});

		it("should render individual script tags for each file in development env", function() {
			return _run({
				files: ["file1.js", "file2.js"]
			}).then(function(result) {
				assert(result.should.equal("<script type=\"text/javascript\" src=\"file1.js\"></script>\n<script type=\"text/javascript\" src=\"file2.js\"></script>\n"));
			});
		});

		it("should replace 'public/' in src for dev rendered script tags", function() {
			return _run({
				files: ["./public/scripts/file1.js", "./public/scripts/file2.js"]
			}).then(function(result) {
				assert(result.should.equal("<script type=\"text/javascript\" src=\"./scripts/file1.js\"></script>\n<script type=\"text/javascript\" src=\"./scripts/file2.js\"></script>\n"));
			});
		});

		it("should render single script tag in production env", function() {
			return _run({
				env: "production",
				files: ["file1.js", "file2.js"]
			}).then(function(result) {
				assert(result.should.equal("<script type=\"text/javascript\" src=\"/script\"></script>"));
			});
		});

		it("should add script route in production env", function() {
			return _run({
				env: "production",
				files: ["file1.js", "file2.js"],
				assert: function(app) {
					assert(app.get.calledWith("/script", sinon.match.func));
				}
			}).then(function(result) {
				assert(result.should.equal("<script type=\"text/javascript\" src=\"/script\"></script>"));
			});
		});

		it("should return minified script on get /script", function() {
			var response = { send: sinon.stub(), header: sinon.stub() };
			var app = { get: function(route, func) {
				if (route == "env")
					return "production";
				if (route == "/script")
					func({}, response, "var blah = 5;");
			} };

			return _run({
				env: "production",
				files: ["file1.js", "file2.js"],
				app: app
			}).then(function(result) {
				assert(response.header.calledWith("Content-Type", "text/javascript"));
				assert(response.send.calledWith("minified"));
			});
		});

		function _run(params) {
			params = params || {};
			var assets = ["file1.js", "file2.js"];
			var app = params.app || { get: sinon.stub().returns(params.env || "development") };

			sinon.stub(bundler, "concatenate").resolves(params.concatenated || "");
			sinon.stub(bundler, "files").resolves(params.files || []);
			sinon.stub(minifier, "compressAsync").resolves("minified");

			return sut.render(assets, app).finally(function() {
				bundler.concatenate.restore();
				bundler.files.restore();
				minifier.compressAsync.restore();

				if (params.assert)
					params.assert(app);
			});
		}
	});
});