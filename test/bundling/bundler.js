require("../setup");
var should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../bundling/bundler");


//		it("should render script tags in developer mode", function(done) {
//			var files = ["file1.js"];
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//
//			sut.render(files, { get: sinon.stub().returns("development") }).then(function(result) {
//				result.should.be.exactly("<script type=\"text/javascript\" src=\"/scripts/" + files[0] + "\"></script>\n");
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//			});
//		});
//
//		it("should render generic script tag in production mode", function(done) {
//			var files = ["file1.js"];
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
//
//			sut.render(files, { get: sinon.stub().returns("production") }).then(function(result) {
//				result.should.be.exactly("<script type=\"text/javascript\" src=\"/script\"></script>");
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//				fs.readFileAsync.restore();
//			});
//		});
//
//		it("should minify in production mode", function(done) {
//			var files = ["file1.js"];
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
//			sinon.spy(minifier, "compressAsync");
//
//			sut.render(files, { get: sinon.stub().returns("production") }).then(function(result) {
//				minifier.compressAsync.calledOnce.should.be.true;
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//				fs.readFileAsync.restore();
//				minifier.compressAsync.restore();
//			});
//		});
//
//		it("should not minify in development mode", function(done) {
//			var files = ["file1.js"];
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
//			sinon.spy(minifier, "compressAsync");
//
//			sut.render(files, { get: sinon.stub().returns("development") }).then(function(result) {
//				minifier.compressAsync.calledOnce.should.be.false;
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//				fs.readFileAsync.restore();
//				minifier.compressAsync.restore();
//			});
//		});
//
//		it("should apply script route to app in production mode", function(done) {
//			var files = ["file1.js"], app = { get: sinon.stub().returns("production") };
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
//			sinon.spy(minifier, "compressAsync");
//
//			sut.render(files, app).then(function(result) {
//				app.get.calledWith("/script", sinon.match.func).should.be.true;
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//				fs.readFileAsync.restore();
//				minifier.compressAsync.restore();
//			});
//		});
//
//		it("should not apply script route to app in development mode", function(done) {
//			var files = ["file1.js"], app = { get: sinon.stub().returns("development") };
//			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
//			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
//			sinon.spy(minifier, "compressAsync");
//
//			sut.render(files, app).then(function(result) {
//				app.get.calledWith("/script", sinon.match.func).should.be.false;
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.statAsync.restore();
//				fs.readFileAsync.restore();
//				minifier.compressAsync.restore();
//			});
//		});

xdescribe("bundler", function() {
	describe("render", function() {
		xit("should read nested files", function(done) {
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