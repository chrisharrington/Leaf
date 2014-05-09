var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var connection = require("./../data/connection");

//describe("test", function() {
//	describe("test", function() {
//		it("should test", function() {
//			return connection.open().then(function () {
//				return repositories.Project.get();
//			}).then(function(projects) {
//				return repositories.Issue.getNextNumber(projects[0]._id);
//			}).then(function(number) {
//				var blah = number;
//			});
//		});
//	});
//});
