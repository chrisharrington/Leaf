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
			return _run({
				app: {
					configure: function(callback) { callback(); }
				}
			}).then(function() {
				assert(_stubs.app.use.calledWith())
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.connection = params.connection || sinon.stub(connection, "open").resolves();
			_stubs.caches = sinon.stub(caches, "init").resolves();
			_stubs.mapper = sinon.stub(mapper, "init").resolves();
			_stubs.controllers = sinon.stub(controllers, "init").returns();
			_stubs.console = sinon.stub(console, "log").returns();
			_stubs.serverPort = sinon.stub(config, "call");
			_stubs.serverPort.withArgs(sinon.match.any, "serverPort").returns(params.port || 12345);
			_stubs.express = sinon.stub(express, "call").returns(_stubs.app = params.app || {
				listen: sinon.stub(),
				configure: sinon.stub(),
				get: sinon.stub().returns(params.env || "development"),
				use: sinon.stub()
			});
			//_stubs.favicon = sinon.stub(express, "favicon").returns(params.favicon || "the favicon");
			return sut();
		}
	});
});