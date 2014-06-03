var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var repositories = require("../../data/repositories");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");
var mongoose = require("mongoose");

var sut = require("../../controllers/milestones");

describe("milestones", function() {
	describe("post /milestones/delete", function() {
		var _stubs;

		it("should set get /milestones/delete route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/milestones/delete", sinon.match.func));
		});

		it("should get issues filtered by project", function() {
			var projectId = "the project id";
			return _run({
				projectId: projectId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: projectId, milestoneId: sinon.match.any }));
			});
		});

		it("should get issues filtered by milestone id as read from the request body", function() {
			var bodyId = "the milestone id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: sinon.match.any, milestoneId: bodyId }));
			});
		});

		it("should get milestone using the switch to id as read from the body", function() {
			var switchTo = "the switch to";
			return _run({
				switchTo: switchTo
			}).then(function() {
				assert(_stubs.getMilestone.calledWith({ _id: switchTo }));
			})
		});

		it("should set retrieved issue milestone according to retrieved milestone", function() {
			var issues = [{ number: 1 }, { number: 2 }], milestone = { _id: "the milestone id", name: "the milestone name" };
			return _run({
				issues: issues,
				milestone: milestone
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, milestone: milestone.name, milestoneId: sinon.match.any }));
				assert(_stubs.updateIssue.calledWith({ number: 2, milestone: milestone.name, milestoneId: sinon.match.any }));
			});
		});

		it("should set retrieved issue milestoneId according to retrieved milestone", function() {
			var issues = [{ number: 1 }, { number: 2 }], milestone = { _id: "the milestone id", name: "the milestone name" };
			return _run({
				issues: issues,
				milestone: milestone
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, milestone: sinon.match.any, milestoneId: milestone._id }));
				assert(_stubs.updateIssue.calledWith({ number: 2, milestone: sinon.match.any, milestoneId: milestone._id }));
			});
		});

		it("should call issue update with user as given from request", function() {
			var issues = [{ number: 1 }], milestone = { _id: "the milestone id", name: "the milestone name" }, user = "the user";
			return _run({
				issues: issues,
				milestone: milestone,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should call milestone remove with milestone id as read from body", function() {
			var bodyId = "the milestone id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.removeMilestone.calledWith(bodyId));
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
			_stubs.getMilestone = sinon.stub(repositories.Milestone, "one").resolves(params.milestone || {});
			_stubs.updateIssue = sinon.stub(repositories.Issue, "updateIssue").resolves();
			_stubs.removeMilestone = sinon.stub(repositories.Milestone, "remove").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/milestones/delete",
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

	describe("post /milestones/save", function() {
		var _stubs;

		it("should set get /milestones/save route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/milestones/save", sinon.match.func));
		});

		it("should map milestone", function() {
			var body = "the request body";
			return _run({
				body: body
			}).then(function() {
				assert(_stubs.map.calledWith("milestone-view-model", "milestone", body));
			});
		});

		it("should get issues if mapped milestone has an id, indicating it should be updated and not inserted", function() {
			var milestone = { _id: "the milestone id" };
			return _run({
				milestone: milestone
			}).then(function() {
				assert(_stubs.getIssue.calledWith({ milestoneId: milestone._id }));
			});
		});

		it("should update milestone if id exists", function() {
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			return _run({
				milestone: milestone
			}).then(function() {
				assert(_stubs.saveMilestone.calledWith(milestone));
			});
		});

		it("should update milestone with project id as read from request if id exists", function() {
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			var projectId = "the project id from request";
			return _run({
				milestone: milestone,
				projectId: projectId
			}).then(function() {
				assert(_stubs.saveMilestone.calledWith({ _id: "the milestone id", name: "the milestone name", project: projectId }));
			});
		});

		it("should set issue milestoneId to given milestone id when updating", function() {
			var bodyId = "the body id";
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				bodyId: bodyId,
				milestone: milestone,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, milestoneId: bodyId, milestone: sinon.match.any }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, milestoneId: bodyId, milestone: sinon.match.any }, sinon.match.any));
			});
		});

		it("should set issue milestoneId to given milestone when updating", function() {
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				milestone: milestone,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, milestoneId: sinon.match.any, milestone: milestone.name }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, milestoneId: sinon.match.any, milestone: milestone.name }, sinon.match.any));
			});
		});

		it("should update issue with user as given in request", function() {
			var milestone = { _id: "the milestone id", name: "the milestone name" };
			var issues = [{ number: 1 }];
			var user = "the user";
			return _run({
				milestone: milestone,
				issues: issues,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should create new id when creating a milestone", function() {
			var milestone = { name: "the name" }, id = "the created id";
			return _run({
				milestone: milestone,
				objectId: id
			}).then(function() {
				assert(_stubs.createMilestone.calledWith({ _id: id, name: sinon.match.any, project: sinon.match.any }));
			});
		});

		it("should create milestone with milestone name", function() {
			var milestone = { name: "the name" }, id = "the created id";
			return _run({
				milestone: milestone,
				objectId: id
			}).then(function() {
				assert(_stubs.createMilestone.calledWith({ _id: sinon.match.any, name: milestone.name, project: sinon.match.any }));
			});
		});

		it("should create milestone with project id as read from request", function() {
			var milestone = { name: "the name" }, id = "the created id", projectId = "the request project id";
			return _run({
				milestone: milestone,
				objectId: id,
				projectId: projectId
			}).then(function() {
				assert(_stubs.createMilestone.calledWith({ _id: sinon.match.any, name: sinon.match.any, project: projectId }));
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
			var body = { name: "the milestone name" }, id = "the id";
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
			_stubs.map = params.map || sinon.stub(mapper, "map").resolves(params.milestone || {});
			_stubs.getIssue = sinon.stub(repositories.Issue, "get").resolves(params.issues || []);
			_stubs.saveMilestone = sinon.stub(repositories.Milestone, "save").resolves();
			_stubs.updateIssue = sinon.stub(repositories.Issue, "updateIssue").resolves();
			_stubs.objectId = sinon.stub(mongoose.Types, "ObjectId").returns(params.objectId || "");
			_stubs.createMilestone = sinon.stub(repositories.Milestone, "create").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/milestones/save",
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