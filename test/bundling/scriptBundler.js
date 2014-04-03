require("../setup");
var should = require("should"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));
var minifier = Promise.promisifyAll(require("yuicompressor"));
var sut = require("../../bundling/scriptBundler");

describe("scriptBundler", function() {
	describe("render", function() {
		it("should render script tags in developer mode", function(done) {
			var directory = "the directory", files = ["file1.js"];
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });

			sut.render(directory, { get: sinon.stub().returns("development") }).then(function(result) {
				result.should.be.exactly("<script type=\"text/javascript\" src=\"/scripts/" + files[0] + "\"></script>\n");
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
			});
		});

		it("should render generic script tag in production mode", function(done) {
			var directory = "the directory", files = ["file1.js"];
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");

			sut.render(directory, { get: sinon.stub().returns("production") }).then(function(result) {
				result.should.be.exactly("<script type=\"text/javascript\" src=\"/script\"></script>");
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
				fs.readFileAsync.restore();
			});
		});

		it("should minify in production mode", function(done) {
			var directory = "the directory", files = ["file1.js"];
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
			sinon.spy(minifier, "compressAsync");

			sut.render(directory, { get: sinon.stub().returns("production") }).then(function(result) {
				minifier.compressAsync.calledOnce.should.be.true;
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
				fs.readFileAsync.restore();
				minifier.compressAsync.restore();
			});
		});

		it("should not minify in development mode", function(done) {
			var directory = "the directory", files = ["file1.js"];
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
			sinon.spy(minifier, "compressAsync");

			sut.render(directory, { get: sinon.stub().returns("development") }).then(function(result) {
				minifier.compressAsync.calledOnce.should.be.false;
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
				fs.readFileAsync.restore();
				minifier.compressAsync.restore();
			});
		});

		it("should apply script route to app in production mode", function(done) {
			var directory = "the directory", files = ["file1.js"], app = { get: sinon.stub().returns("production") };
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
			sinon.spy(minifier, "compressAsync");

			sut.render(directory, app).then(function(result) {
				app.get.calledWith("/script", sinon.match.func).should.be.true;
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
				fs.readFileAsync.restore();
				minifier.compressAsync.restore();
			});
		});

		it("should not apply script route to app in development mode", function(done) {
			var directory = "the directory", files = ["file1.js"], app = { get: sinon.stub().returns("development") };
			sinon.stub(fs, "readdirAsync").withArgs(directory).resolves(files);
			sinon.stub(fs, "statAsync").withArgs("./public/scripts/" + files[0]).resolves({ isDirectory: function() { return false; } });
			sinon.stub(fs, "readFileAsync").withArgs("./public/scripts/" + files[0]).resolves("var blah = 'file contents';");
			sinon.spy(minifier, "compressAsync");

			sut.render(directory, app).then(function(result) {
				app.get.calledWith("/script", sinon.match.func).should.be.false;
				done();
			}).catch(function(e) {
				done(e);
			}).finally(function() {
				fs.readdirAsync.restore();
				fs.statAsync.restore();
				fs.readFileAsync.restore();
				minifier.compressAsync.restore();
			});
		});
	});
});