require("../setup");
var should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));
var sut = require("../../bundling/scriptBundler");

describe("scriptBundler", function() {
	describe("render", function() {
		it("should render script tags in developer mode", function(done) {
			var directory = "the directory";
			var files = ["file1.js"];
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sut.render(directory, { get: sinon.stub().returns("development") }).then(function(result) {
				result.should.be.exactly("<script type=\"text/javaascript\" src=\"/scripts/" + files[0] + "\"></script>\n");
			}).finally(function() {
				done();
			});
		});

//		xit("should render all", function() {
//			var app = { get: sinon.stub().returns("development") };
//			sut.render("./public/scripts", app).finally(function(result) {
//				done();
//			});
//		});
	});
});