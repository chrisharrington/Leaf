var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var models = require("./../data/models");
var connection = require("./../data/connection");
var config = require("./../config");

var mongojs = require("mongojs");

//describe("test", function() {
//	describe("test", function() {
//		it("should test", function(done) {
//
//		});
//	});
//});

