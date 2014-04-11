var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/priorityRepository");

describe("priorityRepository", function() {
	describe("construction", function() {
		it("should set Priority model for base repository", function() {
			assert(sut.model == models.Priority);
		});
	});
});