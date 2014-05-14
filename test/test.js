var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var models = require("./../data/models");
var connection = require("./../data/connection");
var config = require("./../config");

var mongojs = require("mongojs");

describe("test", function() {
	describe("test", function() {
		var db, issues;

		it("should test", function() {
			var count = 5;
			db = mongojs(config.call(this, "databaseUser") + ":" + config.call(this, "databasePassword") + "@oceanic.mongohq.com:10038/issuetracker");
			issues = db.collection("issues");

			var date = Date.now();
			return connection.open().then(function() {
				var promise = _ormGetIssues();
				for (var i = 0; i < count - 1; i++)
					promise = promise.then(_ormGetIssues);

				return promise.then(function () {
					console.log((Date.now() - date) + "ms.");
				});
			});
		});

		function _nativeGetIssues() {
			return new Promise(function(resolve, reject) {
				issues.find(function(err, docs) {
					if (err) reject(err);
					else resolve(docs);
				});
			});
		}

		function _ormGetIssues() {
			return models.Issue.findAsync();
		}
	});
});

