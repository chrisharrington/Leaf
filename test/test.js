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
//				return Promise.all([
//					repositories.Permission.get(),
//					repositories.User.one({ name: "Chris Harrington" })
//				]);
//			}).spread(function(permissions, user) {
//				return permissions.map(function(current) {
//					return repositories.UserPermission.create({ user: user._id, permission: current._id })
//				});
//			}).then(function() {
//				console.log("Done.");
//			}).catch(function(e) {
//				console.log(e.stack.formatStack());
//			});
//		});
//	});
//});