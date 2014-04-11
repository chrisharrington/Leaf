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
		beforeEach(function() {
			sinon.stub(sut, "get").resolves();
		});

		it("should call get with isDeleted false", function() {
			return _run().then(function() {
				assert(sut.get.calledWith({
					isDeleted: false,
					priorityId: sinon.match.any,
					statusId: sinon.match.any,
					developerId: sinon.match.any,
					testerId: sinon.match.any,
					milestoneId: sinon.match.any,
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with priorityId as $in given priorities", function() {
			var priorities = ["first"];
			return _run({ priorities: priorities }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: { $in: priorities },
					statusId: sinon.match.any,
					developerId: sinon.match.any,
					testerId: sinon.match.any,
					milestoneId: sinon.match.any,
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with statusId as $in given statuses", function() {
			var statuses = ["first"];
			return _run({ statuses: statuses }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: sinon.match.any,
					statusId: { $in: statuses },
					developerId: sinon.match.any,
					testerId: sinon.match.any,
					milestoneId: sinon.match.any,
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with developerId as $in given developers", function() {
			var developers = ["first"];
			return _run({ developers: developers }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: sinon.match.any,
					statusId: sinon.match.any,
					developerId: { $in: developers },
					testerId: sinon.match.any,
					milestoneId: sinon.match.any,
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with testerId as $in given testers", function() {
			var testers = ["first"];
			return _run({ testers: testers }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: sinon.match.any,
					statusId: sinon.match.any,
					developerId: sinon.match.any,
					testerId: { $in: testers },
					milestoneId: sinon.match.any,
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with milestoneId as $in given milestones", function() {
			var milestones = ["first"];
			return _run({ milestones: milestones }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: sinon.match.any,
					statusId: sinon.match.any,
					developerId: sinon.match.any,
					testerId: sinon.match.any,
					milestoneId: { $in: milestones },
					typeId: sinon.match.any
				}, sinon.match.any));
			});
		});

		it("should call get with typeId as $in given types", function() {
			var types = ["first"];
			return _run({ types: types }).then(function() {
				assert(sut.get.calledWith({
					isDeleted: sinon.match.any,
					priorityId: sinon.match.any,
					statusId: sinon.match.any,
					developerId: sinon.match.any,
					testerId: sinon.match.any,
					milestoneId: sinon.match.any,
					typeId: { $in: types }
				}, sinon.match.any));
			});
		});

		it("should sort with 'priorityOrder' if the sort comparer given is 'priority'", function() {
			return _run({
				sortComparer: "priority"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { priorityOrder: -1, opened: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any
				}));
			});
		});

		it("should sort with 'statusOrder' if the sort comparer given is 'status'", function() {
			return _run({
				sortComparer: "status"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { statusOrder: -1, opened: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any
				}));
			});
		});

		it("should sort using the given comparer", function() {
			var comparer = "the comparer";
			return _run({
				sortComparer: comparer
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { "the comparer": -1, opened: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any
				}));
			});
		});

		it("should sort by ascending when sort direction is given as 'ascending'", function() {
			return _run({
				sortComparer: "the comparer",
				sortDirection: "ascending"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { "the comparer": 1, opened: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any
				}));
			});
		});

		it("should set skip to be start minus one", function() {
			var start = 10;
			return _run({
				start: start
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: sinon.match.any,
					skip: start - 1,
					end: sinon.match.any
				}));
			});
		});

		it("should set limit to be end minus start plus one", function() {
			var start = 10;
			var end = 20;
			return _run({
				start: start,
				end: end
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: sinon.match.any,
					skip: sinon.match.any,
					limit: end - start + 1
				}));
			});
		});

		afterEach(function() {
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