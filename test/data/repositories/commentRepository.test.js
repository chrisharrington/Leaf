var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/commentRepository");

describe("commentRepository", function() {
	describe("construction", function() {
		it("should set Comment model for base repository", function() {
			assert(sut.model == models.Comment);
		});
	});
});