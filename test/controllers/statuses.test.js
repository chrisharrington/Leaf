var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var repositories = require("../../data/repositories");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");
var mongoose = require("mongoose");

var sut = require("../../controllers/statuses");

describe("statuses", function() {
	describe("post /statuses/delete", function() {
		var _stubs;

		it("should set get /statuses/delete route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/statuses/delete", sinon.match.func));
		});

		it("should get issues filtered by project", function() {
			var projectId = "the project id";
			return _run({
				projectId: projectId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: projectId, statusId: sinon.match.any }));
			});
		});

		it("should get issues filtered by status id as read from the request body", function() {
			var bodyId = "the status id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.getIssues.calledWith({ project: sinon.match.any, statusId: bodyId }));
			});
		});

		it("should get status using the switch to id as read from the body", function() {
			var switchTo = "the switch to";
			return _run({
				switchTo: switchTo
			}).then(function() {
				assert(_stubs.getStatus.calledWith({ _id: switchTo }));
			})
		});

		it("should set retrieved issue status according to retrieved status", function() {
			var issues = [{ number: 1 }, { number: 2 }], status = { _id: "the status id", name: "the status name" };
			return _run({
				issues: issues,
				status: status
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, status: status.name, statusId: sinon.match.any }));
				assert(_stubs.updateIssue.calledWith({ number: 2, status: status.name, statusId: sinon.match.any }));
			});
		});

		it("should set retrieved issue statusId according to retrieved status", function() {
			var issues = [{ number: 1 }, { number: 2 }], status = { _id: "the status id", name: "the status name" };
			return _run({
				issues: issues,
				status: status
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, status: sinon.match.any, statusId: status._id }));
				assert(_stubs.updateIssue.calledWith({ number: 2, status: sinon.match.any, statusId: status._id }));
			});
		});

		it("should call issue update with user as given from request", function() {
			var issues = [{ number: 1 }], status = { _id: "the status id", name: "the status name" }, user = "the user";
			return _run({
				issues: issues,
				status: status,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should call status remove with status id as read from body", function() {
			var bodyId = "the status id";
			return _run({
				bodyId: bodyId
			}).then(function() {
				assert(_stubs.removeStatus.calledWith(bodyId));
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
			_stubs.getStatus = sinon.stub(repositories.Status, "one").resolves(params.status || {});
			_stubs.updateIssue = sinon.stub(repositories.Issue, "updateIssue").resolves();
			_stubs.removeStatus = sinon.stub(repositories.Status, "remove").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/statuses/delete",
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

	describe("post /statuses/save", function() {
		var _stubs;

		it("should set get /statuses/save route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/statuses/save", sinon.match.func));
		});

		it("should map status", function() {
			var body = "the request body";
			return _run({
				body: body
			}).then(function() {
				assert(_stubs.map.calledWith("status-view-model", "status", body));
			});
		});

		it("should get issues if mapped status has an id, indicating it should be updated and not inserted", function() {
			var status = { _id: "the status id" };
			return _run({
				status: status
			}).then(function() {
				assert(_stubs.getIssue.calledWith({ statusId: status._id }));
			});
		});

		it("should update status if id exists", function() {
			var status = { _id: "the status id", name: "the status name" };
			return _run({
				status: status
			}).then(function() {
				assert(_stubs.saveStatus.calledWith(status));
			});
		});

		it("should update status with project id as read from request if id exists", function() {
			var status = { _id: "the status id", name: "the status name" };
			var projectId = "the project id from request";
			return _run({
				status: status,
				projectId: projectId
			}).then(function() {
				assert(_stubs.saveStatus.calledWith({ _id: "the status id", name: "the status name", project: projectId }));
			});
		});

		it("should set issue statusId to given status id when updating", function() {
			var bodyId = "the body id";
			var status = { _id: "the status id", name: "the status name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				bodyId: bodyId,
				status: status,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, statusId: bodyId, status: sinon.match.any }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, statusId: bodyId, status: sinon.match.any }, sinon.match.any));
			});
		});

		it("should set issue statusId to given status when updating", function() {
			var status = { _id: "the status id", name: "the status name" };
			var issues = [{ number: 1 }, { number: 2 }];
			return _run({
				status: status,
				issues: issues
			}).then(function() {
				assert(_stubs.updateIssue.calledWith({ number: 1, statusId: sinon.match.any, status: status.name }, sinon.match.any));
				assert(_stubs.updateIssue.calledWith({ number: 2, statusId: sinon.match.any, status: status.name }, sinon.match.any));
			});
		});

		it("should update issue with user as given in request", function() {
			var status = { _id: "the status id", name: "the status name" };
			var issues = [{ number: 1 }];
			var user = "the user";
			return _run({
				status: status,
				issues: issues,
				user: user
			}).then(function() {
				assert(_stubs.updateIssue.calledWith(sinon.match.any, user));
			});
		});

		it("should create new id when creating a status", function() {
			var status = { name: "the name" }, id = "the created id";
			return _run({
				status: status,
				objectId: id
			}).then(function() {
				assert(_stubs.createStatus.calledWith({ _id: id, name: sinon.match.any, project: sinon.match.any }));
			});
		});

		it("should create status with status name", function() {
			var status = { name: "the name" }, id = "the created id";
			return _run({
				status: status,
				objectId: id
			}).then(function() {
				assert(_stubs.createStatus.calledWith({ _id: sinon.match.any, name: status.name, project: sinon.match.any }));
			});
		});

		it("should create status with project id as read from request", function() {
			var status = { name: "the name" }, id = "the created id", projectId = "the request project id";
			return _run({
				status: status,
				objectId: id,
				projectId: projectId
			}).then(function() {
				assert(_stubs.createStatus.calledWith({ _id: sinon.match.any, name: sinon.match.any, project: projectId }));
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
			var body = { name: "the status name" }, id = "the id";
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
			_stubs.map = params.map || sinon.stub(mapper, "map").resolves(params.status || {});
			_stubs.getIssue = sinon.stub(repositories.Issue, "get").resolves(params.issues || []);
			_stubs.saveStatus = sinon.stub(repositories.Status, "save").resolves();
			_stubs.updateIssue = sinon.stub(repositories.Issue, "updateIssue").resolves();
			_stubs.objectId = sinon.stub(mongoose.Types, "ObjectId").returns(params.objectId || "");
			_stubs.createStatus = sinon.stub(repositories.Status, "create").resolves();

			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/statuses/save",
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