require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../bundling/bundler");

describe("bundler", function() {
	describe("concatenate", function() {
		it("should read asset contents", function() {
			var assets = ["file1.js", "file2.js"];
			sinon.stub(fs, "readFileAsync");
			sinon.stub(fs, "statAsync").resolves({ isDirectory: function() { return false; } });
			return sut.concatenate(assets).then(function() {
				assert(fs.readFileAsync.calledWith("file1.js"));
				assert(fs.readFileAsync.calledWith("file2.js"));
			}).finally(function() {
				fs.readFileAsync.restore();
				fs.statAsync.restore();
			});
		});
	});

	describe("files", function() {
		it("should read directory files", function() {
			var assets = ["directory"];
			sinon.stub(fs, "readFileAsync");
			var stat = sinon.stub(fs, "statAsync");
			stat.withArgs("directory").resolves({ isDirectory: function() { return true; }});
			stat.withArgs("directory/file1.js").resolves({ isDirectory: function() { return false; }});
			stat.withArgs("directory/file2.js").resolves({ isDirectory: function() { return false; }});
			sinon.stub(fs, "readdirAsync").resolves(["file1.js", "file2.js"]);

			return sut.concatenate(assets).then(function() {
				assert(fs.readFileAsync.calledWith("directory/file1.js"));
				assert(fs.readFileAsync.calledWith("directory/file2.js"));
			}).finally(function() {
				fs.readFileAsync.restore();
				fs.statAsync.restore();
				fs.readdirAsync.restore();
			});
		});
	});
});