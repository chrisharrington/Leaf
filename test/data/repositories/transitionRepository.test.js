var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/transitionRepository");

describe("transitionRepository", function() {
	describe("construction", function() {
		it("should set Transition model for base repository", function() {
			assert(sut.model == models.Transition);
		});
	});
});