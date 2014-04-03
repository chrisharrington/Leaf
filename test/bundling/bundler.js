require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../bundling/bundler");

describe("bundler", function() {
	describe("render", function() {
		it("should render development tag with appropriate file", function(done) {
			_run({
				done: done,
				assets: ["file1.js"],
				app: { get: function() { return "development" }},
				config: { buildPerAssetDevRender: function(file) { return "rendered dev tag - " + file + "\n"; }},
				assert: function(result) { assert(result.should.equal("rendered dev tag - file1.js\n")); }
			});
		});

		it("should render development tags with appropriate files", function(done) {
			_run({
				done: done,
				assets: ["file1.js", "file2.js"],
				app: { get: function() { return "development" }},
				config: { buildPerAssetDevRender: function(file) { return "rendered dev tag - " + file + "\n"; }},
				assert: function(result) { assert(result.should.equal("rendered dev tag - file1.js\nrendered dev tag - file2.js\n")); }
			});
		});

		it("should call productionHandler with production environment", function(done) {
			var config = { productionHandler: function() { return Promise.resolve("prodRender"); }};
			_run({
				done: done,
				assets: ["file1.js", "file2.js"],
				app: { get: function() { return "production" }},
				config: config,
				assert: function(result) { assert(result.should.equal("prodRender")); }
			});
		});

		it("should read the contents of every file with production environment", function(done) {
			var config = { productionHandler: function() { return Promise.resolve("prodRender"); }};
			_run({
				done: done,
				assets: ["file1.js", "file2.js"],
				data: [{ "file1.js": "first file contents" }, { "file2.js": "second file contents" }],
				app: { get: function() { return "production" }},
				config: config,
				assert: function(result, stubs) {
					assert(stubs.readFile.calledWith("file1.js"));
					assert(stubs.readFile.calledWith("file2.js"));
				}
			});
		});

		it("should read the contents of every nested file with production environment", function(done) {
			var config = { productionHandler: function() { return Promise.resolve("prodRender"); }};
			_run({
				done: done,
				assets: ["directory1", "directory2"],
				directories: [["directory1", ["file1.js"]], ["directory2", ["file2.js"]]],
				data: [{ "file1.js": "first file contents" }, { "file2.js": "second file contents" }],
				app: { get: function() { return "production" }},
				config: config,
				assert: function(result, stubs) {
					assert(stubs.readFile.calledWith("directory1/file1.js"));
					assert(stubs.readFile.calledWith("directory2/file2.js"));
				}
			});
		});

		function _run(params) {
			_buildDefaultConfiguration(params);

			var stubs = { stat: _buildStatStub(params), readdir: _buildReaddirStub(params), readFile: _buildReadFileStub(params) };
			sut.render(params.assets, params.app, params.config).then(function(result) {
				params.assert(result, stubs);
				params.done();
			}).catch(function(e) {
				params.done(e);
			}).finally(function() {
				fs.statAsync.restore();
				fs.readdirAsync.restore();
				fs.readFileAsync.restore();
			});
		}

		function _buildDefaultConfiguration(params) {
			params.config = params.config || {};
			if (!params.config.buildPerAssetDevRender)
				params.config.buildPerAssetDevRender = function() { return ""; };
			if (!params.config.productionHandler)
				params.config.productionHandler = function() {};
		}

		function _buildStatStub(params) {
			var stat = sinon.stub(fs, "statAsync");
			if (params.directories) {
				params.directories.forEach(function(directoryContainer) {
					stat.withArgs(directoryContainer[0]).resolves({ isDirectory: function() { return true; }});
					directoryContainer[1].forEach(function(file) {
						stat.withArgs(directoryContainer[0] + "/" + file).resolves({ isDirectory: function() { return false; }});
					});
				});
			}
			else
				stat.resolves({ isDirectory: function() { return false; }});
			return stat;
		}

		function _buildReaddirStub(params) {
			var readdir = sinon.stub(fs, "readdirAsync");
			if (params.directories)
				params.directories.forEach(function(directoryContainer) {
					readdir.withArgs(directoryContainer[0]).resolves(directoryContainer[1]);
				});
			else
				readdir.resolves(function() {});
			return readdir;
		}

		function _buildReadFileStub(params) {
			var readFile = sinon.stub(fs, "readFileAsync");
			if (params.data)
				for (var name in params.data)
					readFile.withArgs(name).resolves(params.data[name]);
			else
				readFile.resolves(function() {});
			return readFile;
		}
	});
});

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

//describe("bundler", function() {
//	describe("render", function() {
//		it("should read nested files", function(done) {
//			var directory = "the directory", files = ["./public/scripts/directory1", "./public/scripts/directory2"], app = { get: sinon.stub().returns("development") };
//			var readdir = sinon.stub(fs, "readdirAsync");
//			readdir.withArgs(directory).resolves(files);
//			readdir.withArgs("./public/scripts/directory1").resolves(["d1-file1.js", "d1-file2.js"]);
//			readdir.withArgs("./public/scripts/directory2").resolves(["d2-file1.js", "d2-file2.js"]);
//			var stat = sinon.stub(fs, "statAsync");
//			stat.withArgs("./public/scripts/directory1").resolves({ isDirectory: function() { return true; } });
//			stat.withArgs("./public/scripts/directory2").resolves({ isDirectory: function() { return true; } });
//			stat.withArgs("./public/scripts/directory1/d1-file1.js").resolves({ isDirectory: function() { return false; } });
//			stat.withArgs("./public/scripts/directory1/d1-file2.js").resolves({ isDirectory: function() { return false; } });
//			stat.withArgs("./public/scripts/directory2/d2-file1.js").resolves({ isDirectory: function() { return false; } });
//			stat.withArgs("./public/scripts/directory2/d2-file2.js").resolves({ isDirectory: function() { return false; } });
//
//			sut.buildFileList(files).then(function(list) {
//				list[0].should.equal("./public/scripts/directory1/d1-file1.js");
//				list[1].should.equal("./public/scripts/directory1/d1-file2.js");
//				list[2].should.equal("./public/scripts/directory2/d2-file1.js");
//				list[3].should.equal("./public/scripts/directory2/d2-file2.js");
//				done();
//			}).catch(function(e) {
//				done(e);
//			}).finally(function() {
//				fs.readdirAsync.restore();
//				fs.statAsync.restore();
//			});
//		});
//	});
//});