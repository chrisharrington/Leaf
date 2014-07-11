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

		it("should call models.Issue.updateAsync", function() {
			return _run().then(function() {
				assert(_stubs.update.calledOnce);
			});
		});

		it("should call update with priorityId", function() {
			var priorityId = 12345;
			return _run({
				priorityId: priorityId
			}).then(function() {
				assert(_stubs.update.calledWith({ priorityId: priorityId }, sinon.match.any, sinon.match.any));
			});
		});

		it("should update priority name", function() {
			var priorityName = "tpn";
			return _run({
				priorityName: priorityName
			}).then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, { $set: { priority: priorityName, priorityOrder: sinon.match.any }}, sinon.match.any));
			});
		});

		it("should update priority order", function() {
			var priorityOrder = "tpo";
			return _run({
				priorityOrder: priorityOrder
			}).then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, { $set: { priority: sinon.match.any, priorityOrder: priorityOrder }}, sinon.match.any));
			});
		});

		it("should update multiple documents", function() {
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

			return sut.updateIssues({ _id: params.priorityId || "the priority id", name: params.priorityName || "the priority name" , order: params.priorityOrder || 1 });
		}
	});
});