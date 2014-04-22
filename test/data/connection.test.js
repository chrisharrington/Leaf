var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var mongoose = require("mongoose");
var config = require("../../config");

var sut = require("../../data/connection");

describe("connection", function() {
	describe("open", function() {
		var _stubs;
		var _originalConnection;

		beforeEach(function() {
			_stubs = {};
		});

		it("should open connection to mongo database", function() {
			return _run().then(function() {
				assert(_stubs.connect.calledWith(sinon.match.any, sinon.match.any));
			});
		});

		it("should open connection mongo database as specified from config", function() {
			var user = "the database user", password = "the database password";
			_stubs.config = sinon.stub(config, "call");
			_stubs.config.withArgs(sinon.match.any, "databaseUser").returns(user);
			_stubs.config.withArgs(sinon.match.any, "databasePassword").returns(password);

			return _run().then(function() {
				assert(_stubs.connect.calledWith("mongodb://" + user + ":" + password + "@oceanic.mongohq.com:10038/issuetracker", sinon.match.any));
			});
		});

		it("should open connection with keepalive enabled", function() {
			return _run().then(function() {
				assert(_stubs.connect.calledWith(sinon.match.string, { server: { socketOptions: { keepAlive: 1 } } }));
			});
		});

		it("should reject when failing to open a connection", function() {
			var failed = false;
			return _run({
				error: true
			}).catch(function() {
				failed = true;
			}).finally(function() {
				assert(failed);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();

			Object.defineProperty(mongoose, "connection", {
				configurable: true,
				get: function() {
					return _originalConnection
				}
			});
		});

		function _run(params) {
			params = params || {};
			_stubs.connect = sinon.stub(mongoose, "connect");
			_stubs.console = sinon.stub(console, "log");

			_originalConnection = mongoose.connection;
			Object.defineProperty(mongoose, "connection", {
				configurable: true,
				get: function() {
					return {
						on: function(event, callback) {
							if (!params.error && event == "open") callback();
							else if (params.error && event == "error") callback();
						}
					}
				}
			});

			return sut.open();
		}
	});
});
