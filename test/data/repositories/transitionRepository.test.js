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

	describe("status", function() {
		it("should call repository.get with given status id", function() {
			var statusId = "the status id";
			var get = sinon.stub(sut, "get").resolves();
			return sut.status(statusId).then(function() {
				assert(get.calledWith({ "from._id": statusId }));
			});
		});
	});
});