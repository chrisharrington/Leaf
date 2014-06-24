var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var connection = require("../data/connection");
var caches = require("../data/caches");
var mapper = require("../data/mapping/mapper");
var controllers = require("../controllers/controllers");
var express = require("express");
var config = require("../config");
var versiony = require("versiony");

var sut = require("../init.js");

describe("init", function() {
	describe("init", function() {
		var _stubs;

		beforeEach(function() {
			_stubs = {};
		});

		it("should open a data connection", function() {
			return _run().then(function() {
				assert(_stubs.connection.calledOnce);
			});
		});

		it("should blah", function() {

		});

		it("should initialize controllers", function() {
			return _run().then(function() {
				assert(_stubs.controllers.calledWith(_stubs.app));
			});
		});

		it("should configure application", function() {
			return _run().then(function() {
				assert(_stubs.app.configure.calledWith(sinon.match.func));
			});
		});

		it("should initialize mapper", function() {
			return _run().then(function() {
				assert(_stubs.mapper.calledOnce);
			});
		});

		it("should initialize caches", function() {
			return _run().then(function() {
				assert(_stubs.caches.calledOnce);
			});
		});

		it("should call app.listen with port read from config", function() {
			var port = 8888;
			return _run({
				port: port
			}).then(function() {
				assert(_stubs.app.listen.calledWith(port));
			});
		});

		it("should indicate that the server failed to start on error", function() {
			return _run({
				connection: sinon.stub(connection, "open").rejects("oh noes!")
			}).then(function() {
				assert(_stubs.console.calledWith("Server failed to start: Error: oh noes!"));
			});
		});

		it("should configure the application for the 'development' environment", function() {
			return _run().then(function() {
				assert(_stubs.app.configure.calledWith("development", sinon.match.func));
			});
		});

		it("should configure the application for the 'production' environment", function() {
			return _run().then(function() {
				assert(_stubs.app.configure.calledWith("production", sinon.match.func));
			});
		});

		it("should configure the app with a favicon", function() {
			var orig = express.favicon;
			var favicon = "the favicon";
			Object.defineProperty(express, "favicon", {
				get: function() {
					return function() { return favicon; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(_stubs.app.use.calledWith(favicon));
			}).finally(function() {
				Object.defineProperty(express, "favicon", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should set favicon to read from /public/images/favicon.ico", function() {
			var orig = express.favicon, location, maxAge;
			Object.defineProperty(express, "favicon", {
				get: function() {
					return function(l, ma) {
						location = l;
						maxAge = ma;
					}
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(location.endsWith("/public/images/favicon.ico"));
			}).finally(function() {
				Object.defineProperty(express, "favicon", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should set favicon with max age 2592000000", function() {
			var orig = express.favicon, location, maxAge;
			Object.defineProperty(express, "favicon", {
				get: function() {
					return function(l, ma) {
						location = l;
						maxAge = ma;
					}
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(maxAge.maxAge == 2592000000);
			}).finally(function() {
				Object.defineProperty(express, "favicon", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure the app with compression", function() {
			var orig = express.compress, compression = false;
			Object.defineProperty(express, "compress", {
				get: function() {
					return function() { compression = true; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(compression);
			}).finally(function() {
				Object.defineProperty(express, "compress", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure the app with json", function() {
			var orig = express.json, json = false;
			Object.defineProperty(express, "json", {
				get: function() {
					return function() { json = true; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(json);
			}).finally(function() {
				Object.defineProperty(express, "json", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure the app with urlencoded", function() {
			var orig = express.urlencoded, urlencoded = false;
			Object.defineProperty(express, "urlencoded", {
				get: function() {
					return function() { urlencoded = true; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(urlencoded);
			}).finally(function() {
				Object.defineProperty(express, "urlencoded", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure the app with static", function() {
			var orig = express.static, static = false;
			Object.defineProperty(express, "static", {
				get: function() {
					return function() { static = true; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(static);
			}).finally(function() {
				Object.defineProperty(express, "static", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should set static to read from /public", function() {
			var orig = express.static, location, maxAge;
			Object.defineProperty(express, "static", {
				get: function() {
					return function(l, ma) {
						location = l;
						maxAge = ma;
					}
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(location.endsWith("/public"));
			}).finally(function() {
				Object.defineProperty(express, "static", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should set static with max age 2592000000", function() {
			var orig = express.static, location, maxAge;
			Object.defineProperty(express, "static", {
				get: function() {
					return function(l, ma) {
						location = l;
						maxAge = ma;
					}
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(maxAge.maxAge == 2592000000);
			}).finally(function() {
				Object.defineProperty(express, "static", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure the app with cookieParser", function() {
			var orig = express.cookieParser, cookieParser = false;
			Object.defineProperty(express, "cookieParser", {
				get: function() {
					return function() { cookieParser = true; }
				}
			});
			return _run({
				configure: function(callback) { if (typeof (callback) == "function") callback(); }
			}).then(function() {
				assert(cookieParser);
			}).finally(function() {
				Object.defineProperty(express, "cookieParser", {
					get: function() {
						return orig;
					}
				});
			});
		});

		it("should configure app for development environment", function() {
			return _run({
				configure: sinon.stub()
			}).then(function() {
				assert(_stubs.configure.calledWith("development", sinon.match.any));
			});
		});

		it("should set app variable 'env' to 'development' with development configuration", function() {
			return _run({
				configure: function(env, callback) {
					if (callback) callback();
				}
			}).then(function() {
				assert(_stubs.set.calledWith("env", "development"));
			});
		});

		it("should configure app for production environment", function() {
			return _run({
				configure: sinon.stub()
			}).then(function() {
				assert(_stubs.configure.calledWith("production", sinon.match.any));
			});
		});

		it("should set app variable 'env' to 'production' with production configuration", function() {
			return _run({
				configure: function(env, callback) {
					if (callback) callback();
				}
			}).then(function() {
				assert(_stubs.set.calledWith("env", "production"));
			});
		});

		it("should read build number from package.json", function() {
			return _run().then(function() {
				assert(_stubs.versiony.calledWith("package.json"));
			});
		});

		it("should update patch number", function() {
			return _run().then(function() {
				assert(_stubs.patch.patch.calledOnce);
			});
		});

		it("should write to package.json", function() {
			return _run().then(function() {
				assert(_stubs.to.to.calledWith("package.json"));
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.to = { to: sinon.stub().returns() };
			_stubs.patch = { patch: sinon.stub().returns(_stubs.to) };
			_stubs.versiony = sinon.stub(versiony, "from").returns(_stubs.patch);
			_stubs.connection = params.connection || sinon.stub(connection, "open").resolves();
			_stubs.caches = sinon.stub(caches, "init").resolves();
			_stubs.mapper = sinon.stub(mapper, "init").resolves();
			_stubs.controllers = sinon.stub(controllers, "init").returns();
			_stubs.console = sinon.stub(console, "log").returns();
			_stubs.serverPort = sinon.stub(config, "call");
			_stubs.serverPort.withArgs(sinon.match.any, "serverPort").returns(params.port || 12345);
			_stubs.express = sinon.stub(express, "call").returns(_stubs.app = params.app || {
				listen: sinon.stub(),
				configure: _stubs.configure = params.configure || sinon.stub(),
				get: sinon.stub().returns(params.env || "development"),
				set: _stubs.set = sinon.stub(),
				use: sinon.stub()
			});
			return sut();
		}
	});
});