var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var models = require("./../data/models");
var connection = require("./../data/connection");
var config = require("./../config");

//describe("test", function() {
//	describe("test", function() {
//		it("should test", function(done) {
//			var date;
//			return connection.open().then(function() {
//				var projectId = "532bb0e4654c146016485bec", number = 60;
//				return repositories.Issue.number(projectId, number);
//			}).then(function (issue) {
//				date = Date.now();
//				return repositories.Comment.issue(issue._id, { populate: "user", sort: { date: -1 }});
//			}).then(function (comments) {
//				console.log((Date.now() - date) + "ms");
//			});
//		});
//	});
//});
//
