var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/milestoneRepository");

describe("milestoneRepository", function() {
	describe("construction", function() {
		it("should set Milestone model for base repository", function() {
			assert(sut.model == models.Milestone);
		});
	});

	describe("updateIssues", function() {
		var _stubs;

		it("should update issues with milestone id filter", function() {
			var milestone = { _id: "the id" };
			return _run({
				milestone: milestone
			}).then(function() {
				assert(_stubs.update.calledWith({ milestoneId: milestone._id }, sinon.match.any, sinon.match.any));
			});
		});

		it("should update issues by setting the new milestone name", function() {
			var milestone = { name: "the new milestone name" };
			return _run({
				milestone: milestone
			}).then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, { $set: { milestone: milestone.name }}, sinon.match.any));
			});
		});

		it("should bulk update issues", function() {
			return _run().then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, sinon.match.any, { multi: true }));
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.update = sinon.stub(models.Issue, "updateAsync").resolves();

			return sut.updateIssues(params.milestone || {});
		}
	});
});