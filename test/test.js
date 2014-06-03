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
//		it("should test", function() {
//			return connection.open().then(function() {
//				return models.Issue.updateAsync({ developer: "Chris Harrington" }, { developer: "blah" });
//			}).then(function() {
//				console.log("Done.");
//			}).catch(function(e) {
//				console.log(e.stack.formatStack());
//			});
//		});
//	});
//});