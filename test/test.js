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

		it("should test", function(done) {
			var count = 5;
			var blah = Date.now();
			db = mongojs(config.call(this, "databaseUser") + ":" + config.call(this, "databasePassword") + "@oceanic.mongohq.com:10038/issuetracker");
			console.log((Date.now() - blah) + "ms");
			issues = db.collection("issues");
			done();
//			issues.ensureIndex({ priorityOrder: -1 }, function() {
//				var date = Date.now();
//				return connection.open().then(function () {
//					var promise = _nativeGetIssues();
//					for (var i = 0; i < count - 1; i++)
//						promise = promise.then(_nativeGetIssues);
//
//					return promise.then(function (docs) {
//						console.log(docs.length + " issues.");
//						var time = Date.now() - date;
//						console.log(time + "ms (average " + (time / count).toFixed(2) + "ms)");
//						done();
//					});
//				});
//			});
		});

		function _nativeGetIssues() {
			return new Promise(function(resolve, reject) {
				issues.find({
					isDeleted: false,
					project: mongojs.ObjectId("532bb0e4654c146016485bec")
				}).skip(5000).limit(25).sort({ priorityOrder: -1 }, function(err, docs) {
					if (err) reject(err);
					else resolve(docs);
				});
			});
		}

		function _ormGetIssues() {

			return models.Issue.findAsync({
				isDeleted: false,
				project: "532bb0e4654c146016485bec"
			});
		}
	});
});

