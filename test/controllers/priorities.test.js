var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var repositories = require("../../data/repositories");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");
var mongoose = require("mongoose");

var sut = require("../../controllers/priorities");

describe("priorities", function() {
	describe("post /priorities/delete", function() {
		var _stubs;

		it("should set get /priorities/delete route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/priorities/delete", sinon.match.func));
		});

		it("should get issues filtered by project", function() {
			var projectId = "the project id";
			return _run({
				projectId: projectId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: projectId, priorityId: sinon.match.any }));
			});
		});

		it("should get issues filtered by priority id as read from the request body", function() {
			var bodyId = "the priority id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: sinon.match.any, priorityId: bodyId }));
			});
		});

		it("should get priority using the switch to id as read from the body", function() {
			var switchTo = "the switch to";
			return _run({
				switchTo: switchTo
			}).then(function() {
				assert(_stubs.getPriority.calledWith({ _id: switchTo }));
			})
		});

		it("should set retrieved issue priority according to retrieved priority", function() {
			var issues = [{ number: 1 }, { number: 2 }], priority = { _id: "the priority id", name: "the priority name" };
			return _run({
				issues: issues,
				priority: priority
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, priority: priority.name, priorityId: sinon.match.any }));
				assert(_stubs.updateIssue.calledWith({ number: 2, priority: priority.name, priorityId: sinon.match.any }));
			});
		});

		it("should set retrieved issue priorityId according to retrieved priority", function() {
			var issues = [{ number: 1 }, { number: 2 }], priority = { _id: "the priority id", name: "the priority name" };
			return _run({
				issues: issues,
				priority: priority
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, priority: sinon.match.any, priorityId: priority._id }));
				assert(_stubs.updateIssue.calledWith({ number: 2, priority: sinon.match.any, priorityId: priority._id }));
			});
		});

		it("should call issue update with user as given from request", function() {
			var issues = [{ number: 1 }], priority = { _id: "the priority id", name: "the priority name" }, user = "the user";
			return _run({
				issues: issues,
				priority: priority,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should call priority remove with priority id as read from body", function() {
			var bodyId = "the priority id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.removePriority.calledWith(bodyId));
			});
		});

		it("should send 200", function() {
			return _run({
				assert: function (result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 with error", function() {
			return _run({
				getIssues: sinon.stub(repositories.Issue, "get").rejects(new Error("oh noes!")),
				assert: function (result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.getIssues = params.getIssues || sinon.stub(repositories.Issue, "get").resolves(params.issues || []);
			_stubs.getPriority = sinon.stub(repositories.Priority, "one").resolves(params.priority || {});
			_stubs.updateIssue = sinon.stub(repositories.Issue, "update").resolves();
			_stubs.removePriority = sinon.stub(repositories.Priority, "remove").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/priorities/delete",
				env: params.env,
				request: {
					body: { id: params.bodyId || "the body id", switchTo: params.switchTo || "the switch to id" },
					project: { _id: params.projectId || "the project id" },
					user: params.user || { name: "the user name" }
				},
				assert: params.assert
			});
		}
	});

	describe("post /priorities/save", function() {
		var _stubs;

		it("should set get /priorities/save route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/priorities/save", sinon.match.func));
		});

		it("should map priority", function() {
			var body = "the request body";
			return _run({
				body: body
			}).then(function() {
				assert(_stubs.map.calledWith("priority-view-model", "priority", body));
			});
		});

		it("should get issues if mapped priority has an id, indicating it should be updated and not inserted", function() {
			var priority = { _id: "the priority id" };
			return _run({
				priority: priority
			}).then(function() {
				assert(_stubs.getIssue.calledWith({ priorityId: priority._id }));
			});
		});

		it("should update priority if id exists", function() {
			var priority = { _id: "the priority id", name: "the priority name" };
			return _run({
				priority: priority
			}).then(function() {
				assert(_stubs.savePriority.calledWith(priority));
			});
		});

		it("should update priority with project id as read from request if id exists", function() {
			var priority = { _id: "the priority id", name: "the priority name" };
			var projectId = "the project id from request";
			return _run({
				priority: priority,
				projectId: projectId
			}).then(function() {
				assert(_stubs.savePriority.calledWith({ _id: "the priority id", name: "the priority name", project: projectId }));
			});
		});

		it("should set issue priorityId to given priority id when updating", function() {
			var bodyId = "the body id";
			var priority = { _id: "the priority id", name: "the priority name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				bodyId: bodyId,
				priority: priority,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, priorityId: bodyId, priority: sinon.match.any }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, priorityId: bodyId, priority: sinon.match.any }, sinon.match.any));
			});
		});

		it("should set issue priorityId to given priority when updating", function() {
			var priority = { _id: "the priority id", name: "the priority name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				priority: priority,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, priorityId: sinon.match.any, priority: priority.name }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, priorityId: sinon.match.any, priority: priority.name }, sinon.match.any));
			});
		});

		it("should update issue with user as given in request", function() {
			var priority = { _id: "the priority id", name: "the priority name" };
			var issues = [{ number: 1 }];
			var user = "the user";
			return _run({
				priority: priority,
				issues: issues,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should create new id when creating a priority", function() {
			var priority = { name: "the name" }, id = "the created id";
			return _run({
				priority: priority,
				objectId: id
			}).then(function() {
				assert(_stubs.createPriority.calledWith({ _id: id, name: sinon.match.any, project: sinon.match.any }));
			});
		});

		it("should create priority with priority name", function() {
			var priority = { name: "the name" }, id = "the created id";
			return _run({
				priority: priority,
				objectId: id
			}).then(function() {
				assert(_stubs.createPriority.calledWith({ _id: sinon.match.any, name: priority.name, project: sinon.match.any }));
			});
		});

		it("should create priority with project id as read from request", function() {
			var priority = { name: "the name" }, id = "the created id", projectId = "the request project id";
			return _run({
				priority: priority,
				objectId: id,
				projectId: projectId
			}).then(function() {
				assert(_stubs.createPriority.calledWith({ _id: sinon.match.any, name: sinon.match.any, project: projectId }));
			});
		});

		it("should send 200", function() {
			return _run({
				assert: function (result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			});
		});

		it("should send modified body on success", function() {
			var body = { name: "the priority name" }, id = "the id";
			return _run({
				objectId: id,
				body: body,
				assert: function (result) {
					assert(result.response.send.calledWith({ name: body.name, id: id }, 200));
				}
			});
		});

		it("should send 500 on error", function() {
			return _run({
				map: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.map = params.map || sinon.stub(mapper, "map").resolves(params.priority || {});
			_stubs.getIssue = sinon.stub(repositories.Issue, "get").resolves(params.issues || []);
			_stubs.savePriority = sinon.stub(repositories.Priority, "save").resolves();
			_stubs.updateIssue = sinon.stub(repositories.Issue, "update").resolves();
			_stubs.objectId = sinon.stub(mongoose.Types, "ObjectId").returns(params.objectId || "");
			_stubs.createPriority = sinon.stub(repositories.Priority, "create").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/priorities/save",
				env: params.env,
				request: {
					body: params.body || { id: params.bodyId || "the body id" },
					project: { _id: params.projectId || "the project id" },
					user: params.user || { name: "the user name" }
				},
				assert: params.assert
			});
		}
	});
});