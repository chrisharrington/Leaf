require("../setup");
var assert = require("assert"), should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var minifier = Promise.promisifyAll(require("yuicompressor"));
var sut = require("../../bundling/scriptBundler");

describe("scriptBundler", function() {
	describe("render", function() {
		it("should call bundler.render", function() {
			var render = sinon.stub(require("../../bundling/bundler"), "render");

			var assets = ["file1.js"], app = sinon.stub();
			sut.render(assets, app);

			assert(render.calledOnce);

			render.restore();
		});

		it("should return promise", function() {
			var render = sinon.stub(require("../../bundling/bundler"), "render").resolves("the result");

			var assets = ["file1.js"], app = sinon.stub();
			sut.render(assets, app).then(function(result) {
				assert(result.should.equal("the result"));
			});

			render.restore();
		});
	});

	describe("buildPerAssetDevRender", function() {
		it("should build script tag", function() {
			sut.buildPerAssetDevRender("file.js").should.equal("<script type=\"text/javascript\" src=\"file.js\"></script>\n");
		});

		it("should remove 'public/' from rendered paths", function() {
			sut.buildPerAssetDevRender("./public/file.js").should.equal("<script type=\"text/javascript\" src=\"./file.js\"></script>\n");
		});
	});

	describe("handleProduction", function() {
		it("should minify scripts", function(done) {
			var script = "var blah = 4;";
			var promise = Promise.resolve(script);
			var app = { get: sinon.stub() };
			var spy = sinon.spy(minifier, "compressAsync");

			sut.handleProduction(promise, app).then(function() {
				assert(minifier.compressAsync.calledOnce);
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				minifier.compressAsync.restore();
			});
		});

		it("should set route for retrieving minified javascript", function(done) {
			var script = "var blah = 4;";
			var promise = Promise.resolve(script);
			var app = { get: sinon.stub() };

			sut.handleProduction(promise, app).then(function() {
				assert(app.get.calledWith("/script", sinon.match.func));
				done();
			}).catch(function(e) {
				done(e);
			});
		});
	});

	describe("writeProductionScriptToResponse", function() {
		it("should set content type to javascript", function() {
			var script = "the script";
			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
			sut.writeProductionScriptToResponse({}, response, script);

			assert(response.writeHead.calledWith(200, { "Content-Type": "text/javascript" }));
		});

		it("should write script to response stream", function() {
			var script = "the script";
			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
			sut.writeProductionScriptToResponse({}, response, script);

			assert(response.write.calledWith(script));
		});

		it("should end the response", function() {
			var script = "the script";
			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
			sut.writeProductionScriptToResponse({}, response, script);

			assert(response.end.calledOnce);
		});
	});
});