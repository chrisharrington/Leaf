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

	describe("updateIssues", function() {
		var _stubs;

		it("should update issues with priority id filter", function() {
			var priority = { _id: "the id" };
			return _run({
				priority: priority
			}).then(function() {
				assert(_stubs.update.calledWith({ priorityId: priority._id }, sinon.match.any, sinon.match.any));
			});
		});

		it("should update issues by setting the new priority name", function() {
			var priority = { name: "the new priority name" };
			return _run({
				priority: priority
			}).then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, { $set: { priority: priority.name }}, sinon.match.any));
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

			return sut.updateIssues(params.priority || {});
		}
	});
});