var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/sequenceRepository");

describe("sequenceRepository", function() {
	describe("construction", function() {
		it("should set Sequence model for base repository", function() {
			assert(sut.model == models.Sequence);
		});

		it("should call findOneAndUpdateAsync with _id set as given name", function() {
			var name = "the name";
			var find = sinon.stub(sut.model, "findOneAndUpdateAsync").resolves({ sequence: 1 });

			return sut.next(name).then(function() {
				assert(find.calledWith({ _id: name }, sinon.match.any, sinon.match.any));
			}).finally(function() {
				find.restore();
			});
		});

		it("should call findOneAndUpdateAsync so as to increase the sequence by one", function() {
			var name = "the name";
			var find = sinon.stub(sut.model, "findOneAndUpdateAsync").resolves({ sequence: 1 });

			return sut.next(name).then(function() {
				assert(find.calledWith(sinon.match.any, { $inc: { sequence: 1 }}, sinon.match.any));
			}).finally(function() {
				find.restore();
			});
		});

		it("should call findOneAndUpdateAsync with new set to true", function() {
			var name = "the name";
			var find = sinon.stub(sut.model, "findOneAndUpdateAsync").resolves({ sequence: 1 });

			return sut.next(name).then(function() {
				assert(find.calledWith(sinon.match.any, sinon.match.any, { new: true, upsert: sinon.match.any }));
			}).finally(function() {
				find.restore();
			});
		});

		it("should call findOneAndUpdateAsync with upsert set to true", function() {
			var name = "the name";
			var find = sinon.stub(sut.model, "findOneAndUpdateAsync").resolves({ sequence: 1 });

			return sut.next(name).then(function() {
				assert(find.calledWith(sinon.match.any, sinon.match.any, { new: sinon.match.any, upsert: true }));
			}).finally(function() {
				find.restore();
			});
		});

		it("should resolve with resulting sequence", function() {
			var name = "the name", sequence = 10;
			var find = sinon.stub(sut.model, "findOneAndUpdateAsync").resolves({ sequence: sequence });

			return sut.next(name).then(function(result) {
				assert.equal(result, sequence);
			}).finally(function() {
				find.restore();
			});
		});
	});
});