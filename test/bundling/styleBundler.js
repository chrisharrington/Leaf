require("../setup");
var assert = require("assert"), should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var less = Promise.promisifyAll(require("less"));
var sut = require("../../bundling/styleBundler");

//describe("styleBundler", function() {
//	describe("render", function() {
//		it("should call bundler.render", function() {
//			var render = sinon.stub(require("../../bundling/bundler"), "render");
//
//			var assets = ["file1.js"], app = sinon.stub();
//			sut.render(assets, app);
//
//			assert(render.calledOnce);
//
//			render.restore();
//		});
//
//		it("should return promise", function() {
//			var render = sinon.stub(require("../../bundling/bundler"), "render").resolves("the result");
//
//			var assets = ["file1.js"], app = sinon.stub();
//			sut.render(assets, app).then(function(result) {
//				assert(result.should.equal("the result"));
//			});
//
//			render.restore();
//		});
//	});
//
//	describe("buildPerAssetDevRender", function() {
//		it("should build style tag", function() {
//			sut.buildPerAssetDevRender("file.css").should.equal("<link rel=\"stylesheet\" href=\"file.css\" type=\"text/css\" />\n");
//		});
//
//		it("should remove 'public/' from rendered paths", function() {
//			sut.buildPerAssetDevRender("./public/file.css").should.equal("<link rel=\"stylesheet\" href=\"./file.css\" type=\"text/css\" />\n");
//		});
//	});
//
//	describe("handleProduction", function() {
//		it("should lessify concatenated css", function(done) {
//			var css = "div.blah { color:red; }";
//			var promise = Promise.resolve(css);
//			var app = { get: sinon.stub() };
//
//			var render = sinon.spy(less, "renderAsync");
//			sut.handleProduction(promise, app).then(function() {
//				assert(render.calledWith(css));
//				done();
//			}).finally(function() {
//				less.renderAsync.restore();
//			});
//		});
//
//		it("should set production style route", function(done) {
//			var css = "div.blah { color:red; }";
//			var promise = Promise.resolve(css);
//			var app = { get: sinon.stub() };
//
//			var render = sinon.spy(less, "renderAsync");
//			sut.handleProduction(promise, app).then(function() {
//				assert(app.get.calledWith("/style", sinon.match.func));
//				done();
//			}).finally(function() {
//				less.renderAsync.restore();
//			});
//		});
//	});
//
//	describe("writeProductionStyleToResponse", function() {
//		it("should set content type to css", function() {
//			var css = "the css";
//			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
//			sut.writeProductionStyleToResponse({}, response, css);
//
//			assert(response.writeHead.calledWith(200, { "Content-Type": "text/css" }));
//		});
//
//		it("should write script to response stream", function() {
//			var css = "the css";
//			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
//			sut.writeProductionStyleToResponse({}, response, css);
//
//			assert(response.write.calledWith(css));
//		});
//
//		it("should end the response", function() {
//			var css = "the css";
//			var response = { writeHead: sinon.stub(), write: sinon.stub(), end: sinon.stub() };
//			sut.writeProductionStyleToResponse({}, response, css);
//
//			assert(response.end.calledOnce);
//		});
//	});
//});