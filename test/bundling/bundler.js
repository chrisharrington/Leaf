require("../setup");
var should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../bundling/bundler");

describe("bundler", function() {
	describe("buildFileList", function() {
		it("should read nested files", function(done) {
			var directory = "the directory", files = ["./public/scripts/directory1", "./public/scripts/directory2"], app = { get: sinon.stub().returns("development") };
			var readdir = sinon.stub(fs, "readdirAsync");
			readdir.withArgs(directory).resolves(files);
			readdir.withArgs("./public/scripts/directory1").resolves(["d1-file1.js", "d1-file2.js"]);
			readdir.withArgs("./public/scripts/directory2").resolves(["d2-file1.js", "d2-file2.js"]);
			var stat = sinon.stub(fs, "statAsync");
			stat.withArgs("./public/scripts/directory1").resolves({ isDirectory: function() { return true; } });
			stat.withArgs("./public/scripts/directory2").resolves({ isDirectory: function() { return true; } });
			stat.withArgs("./public/scripts/directory1/d1-file1.js").resolves({ isDirectory: function() { return false; } });
			stat.withArgs("./public/scripts/directory1/d1-file2.js").resolves({ isDirectory: function() { return false; } });
			stat.withArgs("./public/scripts/directory2/d2-file1.js").resolves({ isDirectory: function() { return false; } });
			stat.withArgs("./public/scripts/directory2/d2-file2.js").resolves({ isDirectory: function() { return false; } });

			sut.buildFileList(files).then(function(list) {
				list[0].should.equal("./public/scripts/directory1/d1-file1.js");
				list[1].should.equal("./public/scripts/directory1/d1-file2.js");
				list[2].should.equal("./public/scripts/directory2/d2-file1.js");
				list[3].should.equal("./public/scripts/directory2/d2-file2.js");
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
			});
		});
	});
});