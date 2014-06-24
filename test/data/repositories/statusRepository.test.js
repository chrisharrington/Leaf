var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/statusRepository");

describe("statusRepository", function() {
	describe("construction", function() {
		it("should set Status model for base repository", function() {
			assert(sut.model == models.Status);
		});
	});

	describe("updateIssues", function() {
		var _stubs;

		it("should update issues with status id filter", function() {
			var status = { _id: "the id" };
			return _run({
				status: status
			}).then(function() {
				assert(_stubs.update.calledWith({ statusId: status._id }, sinon.match.any, sinon.match.any));
			});
		});

		it("should update issues by setting the new status name", function() {
			var status = { name: "the new status name" };
			return _run({
				status: status
			}).then(function() {
				assert(_stubs.update.calledWith(sinon.match.any, { $set: { status: status.name }}, sinon.match.any));
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

			return sut.updateIssues(params.status || {});
		}
	});
});