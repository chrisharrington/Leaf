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

		it("should set sort to be by name ascending", function() {
			assert(sut.sort.name == 1);
		});

		it("should have populate set to 'issue user'", function() {
			assert(sut.populate == "issue user");
		});
	});
});