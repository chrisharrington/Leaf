var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/projectRepository");

describe("projectRepository", function() {
	describe("construction", function() {
		it("should set Project model for base repository", function() {
			assert(sut.model == models.Project);
		});

		it("should set sort to be name ascending", function() {
			assert(sut.sort.name == 1);
		});
	});
});