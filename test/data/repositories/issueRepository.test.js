var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/issueRepository");

describe("issueRepository", function() {
	describe("construction", function() {
		it("should set Issue model for base repository", function() {
			assert(sut.model == models.Issue);
		});
	});

	describe("search", function() {
//		it("should get issues from repository", function() {
//			return _run();
//		});

		afterEach(function() {
			if (sut.get.restore)
				sut.get.restore();
		});

		function _run(params) {
			params = params || {};
			return sut.search(
				params.filter || {
					priorities: params.priorities || [],
					statuses: params.statuses || [],
					developers: params.developers || [],
					testers: params.testers || [],
					milestones: params.milestones || [],
					types: params.types || []
				},
				params.sortDirection || "the sort direction",
				params.sortComparer || "the sort comparer",
				params.start || 1,
				params.end || 10
			)
		}
	})
});