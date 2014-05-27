var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var models = require("./../data/models");
var connection = require("./../data/connection");
var config = require("./../config");
//
//describe("test", function() {
//	describe("test", function() {
//		it("should test", function() {
//			return connection.open().then(function() {
//				var repository = repositories.Permission;
//				return Promise.all([
//					repository.create({ name: "Create an issue" }),
//					repository.create({ name: "Edit an issue" }),
//					repository.create({ name: "Delete an issue" }),
//					repository.create({ name: "Create a user" }),
//					repository.create({ name: "Delete a user" }),
//					repository.create({ name: "Edit a user" }),
//					repository.create({ name: "Modify user permissions" }),
//					repository.create({ name: "Reset a user's password" })
//				]);
//			}).then(function() {
//				console.log("Done.");
//			}).catch(function(e) {
//				console.log(e.stack.formatStack());
//			});
//		});
//	});
//});