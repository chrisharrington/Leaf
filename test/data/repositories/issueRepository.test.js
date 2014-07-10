require("../../setup");
var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models"),
	repositories = require("../../../data/repositories"),
	base = require("../../base");

var priorityCache = require("../../../data/caches/priorityCache");

var sut = require("../../../data/repositories/issueRepository");

describe("issueRepository", function() {
	describe("construction", function() {
		it("should set Issue model for base repository", function() {
			assert(sut.model == models.Issue);
		});
	});

	describe("search", function() {
		var _stubs;

		it("should call get with given project id", function() {
			var projectId = "the project id";
			return _run({
				projectId: projectId
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].project, projectId);
			});
		});

		it("should call get with isDeleted false", function() {
			return _run().then(function() {
				assert.equal(sut.get.firstCall.args[0].isDeleted, false);
			});
		});

		it("should call get with priorityId as $in given priorities", function() {
			var priorities = ["first"];
			return _run({ priorities: priorities }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].priorityId, { $in: priorities });
			});
		});

		it("should call get with statusId as $in given statuses", function() {
			var statuses = ["first"];
			return _run({ statuses: statuses }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].statusId, { $in: statuses });
			});
		});

		it("should call get with developerId as $in given developers", function() {
			var developers = ["first"];
			return _run({ developers: developers }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].developerId, { $in: developers });
			});
		});

		it("should call get with testerId as $in given testers", function() {
			var testers = ["first"];
			return _run({ testers: testers }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].testerId, { $in: testers });
			});
		});

		it("should call get with milestoneId as $in given milestones", function() {
			var milestones = ["first"];
			return _run({ milestones: milestones }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].milestoneId, { $in: milestones });
			});
		});

		it("should call get with typeId as $in given types", function() {
			var types = ["first"];
			return _run({ types: types }).then(function() {
				assert.deepEqual(sut.get.firstCall.args[0].typeId, { $in: types });
			});
		});

		it("should sort with 'priorityOrder' if the sort comparer given is 'priority'", function() {
			return _run({
				sortComparer: "priority"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { priorityOrder: -1, number: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any,
					projection: sinon.match.any
				}));
			});
		});

		it("should sort with 'statusOrder' if the sort comparer given is 'status'", function() {
			return _run({
				sortComparer: "status"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { statusOrder: -1, number: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any,
					projection: sinon.match.any
				}));
			});
		});

		it("should sort using the given comparer", function() {
			var comparer = "the comparer";
			return _run({
				sortComparer: comparer
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { "the comparer": -1, number: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any,
					projection: sinon.match.any
				}));
			});
		});

		it("should sort by ascending when sort direction is given as 'ascending'", function() {
			return _run({
				sortComparer: "the comparer",
				sortDirection: "ascending"
			}).then(function() {
				assert(sut.get.calledWith(sinon.match.any, {
					sort: { "the comparer": 1, number: 1 },
					skip: sinon.match.any,
					limit: sinon.match.any,
					projection: sinon.match.any
				}));
			});
		});

		it("should set skip to be start minus one", function() {
			var start = 10;
			return _run({
				start: start
			}).then(function() {
				assert.equal(sut.get.firstCall.args[1].skip, start - 1);
			});
		});

		it("should set limit to be end minus start plus one", function() {
			var start = 10;
			var end = 20;
			return _run({
				start: start,
				end: end
			}).then(function() {
				assert.equal(sut.get.firstCall.args[1].limit, end - start + 1);
			});
		});

		it("should add no priorities filter when no priorities are given", function() {
			return _run({
				priorities: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].priorityId, undefined);
			});
		});

		it("should add no statuses filter when no statuses are given", function() {
			return _run({
				statuses: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].statusId, undefined);
			});
		});

		it("should add no developers filter when no developers are given", function() {
			return _run({
				developers: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].developerId, undefined);
			});
		});

		it("should add no testers filter when no testers are given", function() {
			return _run({
				testers: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].testerId, undefined);
			});
		});

		it("should add no milestones filter when no milestones are given", function() {
			return _run({
				milestones: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].milestoneId, undefined);
			});
		});

		it("should add no types filter when no types are given", function() {
			return _run({
				types: []
			}).then(function() {
				assert.equal(sut.get.firstCall.args[0].typeId, undefined);
			});
		});

		it("should set issue.priority from retrieved priorities", function() {
			return _run({
				issues: [{ id: 1, priorityId: 10, name: "the name" }],
				cachedPriorities: [{ id: 10, name: "the priority name" }, { id: 11, name: "some other name" }]
			}).then(function(issues) {
				assert.equal(issues[0].priority, "the priority name");
			});
		});

		afterEach(function() {
			sut.get.restore();

			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.issues = sinon.stub(sut, "get").resolves(params.issues || []);
			_stubs.priorities = sinon.stub(priorityCache, "all").resolves(params.cachedPriorities || []);

			return sut.search(params.projectId || "the project id",
				params.filter || {
					priorities: params.priorities || ["the priority id"],
					statuses: params.statuses || ["the status id"],
					developers: params.developers || ["the developer id"],
					testers: params.testers || ["the tester id"],
					milestones: params.milestones || ["the milestone id"],
					types: params.types || ["the type id"]
				},
				params.sortDirection || "the sort direction",
				params.sortComparer || "the sort comparer",
				params.start || 1,
				params.end || 10
			)
		}
	});

	describe("number", function() {
		var _stubs;

		it("should call one with given number", function() {
			var number = 123;
			return sut.number("the project id", number).then(function() {
				assert(sut.one.calledWith({ project: sinon.match.any, number: number }));
			});
		});

		it("should call get with given project id", function() {
			var projectId = "the project id";
			return sut.number(projectId, 123).then(function() {
				assert(sut.one.calledWith({ project: projectId, number: sinon.match.any }));
			});
		});

		it("should set the milestone from cached milestones", function() {
				
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.number = sinon.stub(sut, "one").resolves(params.issue || {});
			_stubs.milestones = sinon.stub(caches.Milestone, "dict").resolves(params.milestones || { 1: { name: "the milestone" }});
			_stubs.statuses = sinon.stub(caches.Status, "dict").resolves(params.statuses || { 1: { name: "the status" }});
			_stubs.priorities = sinon.stub(caches.Priority, "dict").resolves(params.priorities || { 1: { name: "the priority" }});
			_stubs.issueTypes = sinon.stub(caches.IssueType, "dict").resolves(params.issueTypes || { 1: { name: "the issue type" }});
			_stubs.users = sinon.stub(caches.User, "dict").resolves(params.users || { 1: { name: "the user" }});

			return sut.number(params.projectId, params.number);
		}

		afterEach(function() {
			sut.one.restore();
		})
	});

	describe("update", function() {
		var _stubs = {};

		it("should save", function() {
			return _run().then(function() {
				assert(_stubs.save.calledOnce);
			});
		});

		it("should call repository.details with model._id", function() {
			var id = "the model id";
			return _run({
				id: id
			}).then(function() {
				assert(_stubs.issueDetails.calledWith(id));
			});
		});

		it("should get milestone details with model.milestoneId", function() {
			var milestoneId = "the model's milestone id";
			return _run({
				milestoneId: milestoneId
			}).then(function() {
				assert(_stubs.milestoneDetails.calledWith(milestoneId));
			});
		});

		it("should get priority details with model.priorityId", function() {
			var priorityId = "the model's priority id";
			return _run({
				priorityId: priorityId
			}).then(function() {
				assert(_stubs.priorityDetails.calledWith(priorityId));
			});
		});

		it("should get status details with model.statusId", function() {
			var statusId = "the model's status id";
			return _run({
				statusId: statusId
			}).then(function() {
				assert(_stubs.statusDetails.calledWith(statusId));
			});
		});

		it("should get issue type details with model.issueTypeId", function() {
			var typeId = "the model's type id";
			return _run({
				typeId: typeId
			}).then(function() {
				assert(_stubs.issueTypeDetails.calledWith(typeId));
			});
		});

		it("should get developer details with model.developerId", function() {
			var developerId = "the model's developer id";
			return _run({
				developerId: developerId
			}).then(function() {
				assert(_stubs.userDetails.calledWith(developerId));
			});
		});

		it("should get tester details with model.testerId", function() {
			var testerId = "the model's tester id";
			return _run({
				testerId: testerId
			}).then(function() {
				assert(_stubs.userDetails.calledWith(testerId));
			});
		});

		it("should set basic data to issue as retrieved before saving", function() {
			var name = "the new name", number = 12345, details = "the new details", issue = { saveAsync: sinon.stub().resolves() };
			return _run({ name: name, number: number, details: details, issueDetailsResult: issue }).then(function() {
				assert(issue.name == name);
				assert(issue.number == number);
				assert(issue.details == details);
			});
		});

		it("should set priority data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var priority = { _id: "the priority id", name: "the priority name", order: 123 };
			return _run({ priorityDetailsResult: priority, issueDetailsResult: issue }).then(function() {
				assert(issue.priorityId == priority._id);
				assert(issue.priority == priority.name);
				assert(issue.priorityOrder == priority.order);
			});
		});

		it("should set status data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var status = { _id: "the status id", name: "the status name", order: 123 };
			return _run({ statusDetailsResult: status, issueDetailsResult: issue }).then(function() {
				assert(issue.statusId == status._id);
				assert(issue.status == status.name);
				assert(issue.statusOrder == status.order);
			});
		});

		it("should set updated by info using given user", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var user = { _id: "the user id", name: "the user name" };
			return _run({ user: user, issueDetailsResult: issue }).then(function() {
				assert(issue.updatedById == user._id);
				assert(issue.updatedBy == user.name);
			});
		});

		it("should set milestone data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			return _run({ milestoneDetailsResult: milestone, issueDetailsResult: issue }).then(function() {
				assert(issue.milestoneId == milestone._id);
				assert(issue.milestone == milestone.name);
			});
		});

		it("should set type data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var type = { _id: "the type id", name: "the type name" };
			return _run({ issueTypeDetailsResult: type, issueDetailsResult: issue }).then(function() {
				assert(issue.typeId == type._id);
				assert(issue.type == type.name);
			});
		});

		it("should set developer data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var developer = { _id: "the developer id", name: "the developer name" };
			return _run({ developerDetailsResult: developer, issueDetailsResult: issue }).then(function() {
				assert(issue.developerId == developer._id);
				assert(issue.developer == developer.name);
			});
		});

		it("should set tester data to issue as retrieved before saving", function() {
			var issue = { saveAsync: sinon.stub().resolves() };
			var tester = { _id: "the tester id", name: "the tester name" };
			return _run({ testerDetailsResult: tester, issueDetailsResult: issue }).then(function() {
				assert(issue.testerId == tester._id);
				assert(issue.tester == tester.name);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.issueDetails = params.issueDetails || sinon.stub(sut, "details").resolves(params.issueDetailsResult || { saveAsync: _stubs.save = sinon.stub().resolves() });
			_stubs.milestoneDetails = params.milestoneDetails || sinon.stub(repositories.Milestone, "details").resolves(params.milestoneDetailsResult || {});
			_stubs.priorityDetails = params.priorityDetails || sinon.stub(repositories.Priority, "details").resolves(params.priorityDetailsResult || {});
			_stubs.statusDetails = params.statusDetails || sinon.stub(repositories.Status, "details").resolves(params.statusDetailsResult || {});
			_stubs.issueTypeDetails = params.issueTypeDetails || sinon.stub(repositories.IssueType, "details").resolves(params.issueTypeDetailsResult || {});
			_stubs.userDetails = params.userDetails || sinon.stub(repositories.User, "details");
			_stubs.userDetails.withArgs(params.developerId || "the developer id").resolves(params.developerDetailsResult || {});
			_stubs.userDetails.withArgs(params.testerId || "the tester id").resolves(params.testerDetailsResult || {});
			_stubs.date = params.date || sinon.stub(Date, "now");

			return sut.updateIssue(params.model || {
				_id: params.id || "the id",
				milestoneId: params.milestoneId || "the milestone id",
				priorityId: params.priorityId || "the priority id",
				statusId: params.statusId || "the status id",
				typeId: params.typeId || "the type id",
				developerId: params.developerId || "the developer id",
				testerId: params.testerId || "the tester id",
				name: params.name || "the name",
				number: params.number || 1,
				details: params.details || "the details"
			}, params.user || {
				_id: params.userId || "the user id",
				name: params.name || "the user name"
			});
		}
	});

	describe("getNextNumber", function() {
		it("should return the next available issue number for the project", function() {
			var issue = { number: 10 };
			var get = sinon.stub(sut, "one").resolves(issue);
			return sut.getNextNumber("the project id").then(function(number) {
				assert(number == issue.number+1);
			}).finally(function() {
				sut.one.restore();
			});
		});

		it("should retrieve issue using the given project id", function() {
			var projectId = "the project id";
			var get = sinon.stub(sut, "one").resolves({ number: 10 });
			return sut.getNextNumber(projectId).then(function() {
				assert(get.calledWith({ project: projectId }));
			}).finally(function() {
				sut.one.restore();
			});
		});

		it("should sort by number descending when getting issue", function() {
			var get = sinon.stub(sut, "one").resolves({ number: 10 });
			return sut.getNextNumber("the project id").then(function() {
				assert(get.calledWith(sinon.match.any, { sort: { number: -1 }}));
			}).finally(function() {
				sut.one.restore();
			});
		});
	});

	describe("issueCountsPerUser", function() {
		var _stubs;

		it("should retrieve users filtered by project", function() {
			var projectId = "the project id to filter";
			return _run({
				projectId: projectId
			}).then(function() {
				assert(_stubs.getUsers.calledWith({ project: projectId }));
			});
		});

		it("should get developer counts for each user", function() {
			var users = [{ _id: "first" }, { _id: "second" }];
			return _run({
				users: users
			}).then(function() {
				assert(_stubs.count.calledWith({ developerId: "first" }));
				assert(_stubs.count.calledWith({ developerId: "second" }));
			});
		});

		it("should get tester counts for each user", function() {
			var users = [{ _id: "first" }, { _id: "second" }];
			return _run({
				users: users
			}).then(function() {
				assert(_stubs.count.calledWith({ testerId: "first" }));
				assert(_stubs.count.calledWith({ testerId: "second" }));
			});
		});

		it("should return result keyed by user id", function() {
			var users = [{ _id: "first" }, { _id: "second" }];
			return _run({
				users: users
			}).then(function(result) {
				assert(result.first);
				assert(result.second);
			});
		});

		it("should return developer counts in result", function() {
			var users = [{ _id: "the user id" }], developerCount = 10;
			return _run({
				users: users,
				developerCount: developerCount
			}).then(function(result) {
				assert(result["the user id"].developer == developerCount);
			});
		});

		it("should return tester counts in result", function() {
			var users = [{ _id: "the user id" }], testerCount = 10;
			return _run({
				users: users,
				testerCount: testerCount
			}).then(function(result) {
				assert(result["the user id"].tester == testerCount);
			});
		});

		afterEach(function() {
			base.restoreStubs(_stubs);
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.getUsers = sinon.stub(repositories.User, "get").resolves(params.users || []);
			_stubs.count = sinon.stub(models.Issue, "countAsync");
			_stubs.count.withArgs({ developerId: params.users && params.users.length > 0 ? params.users[0]._id : sinon.match.any }).resolves(params.developerCount);
			_stubs.count.withArgs({ testerId: sinon.match.any }).resolves(params.testerCount);

			return sut.issueCountsPerUser(params.projectId || "the project id");
		}
	});
});