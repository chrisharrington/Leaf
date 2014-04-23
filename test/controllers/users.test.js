var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var fs = Promise.promisifyAll(require("fs"));
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapping/mapper");
var mustache = require("mustache");

var sut = require("../../controllers/users");

describe("users", function() {
	describe("get /users", function() {
		it("should set get /users route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/users", sinon.match.func));
		});

		it("should read html from public/views/users.html", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.readFile.calledWith("public/views/users.html"));
				}
			});
		});

		it("should get issues filtered by project id", function() {
			var projectId = "the project id";
			return _run({
				assert: function(result) {
					assert(result.stubs.getIssues.calledWith({ project: projectId }));
				}
			});
		});

		it("should get users", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.getUsers.calledWith());
				}
			});
		});

		it("should map users", function() {
			var users = [{ name: "blah" }];
			return _run({
				users: users,
				assert: function(result) {
					assert(result.stubs.mapAll.calledWith("user", "user-summary-view-model", users));
				}
			})
		});

		it("should render using html and mapped users", function() {
			var html = "the html";
			var mapped = ["the first mapped user", "the second mapper user"];
			return _run({
				html: html,
				mapped: mapped,
				assert: function(result) {
					assert(result.stubs.mustache.calledWith(html.toString(), { users: JSON.stringify(mapped) }));
				}
			});
		});

		it("should send 200", function() {
			return _run({
					assert: function(result) {
						assert(result.response.send.calledWith(sinon.match.any, 200));
					}
			});
		});

		it("should send rendered html", function() {
			var rendered = "the rendered html";
			return _run({
				rendered: rendered,
				assert: function(result) {
					assert(result.response.send.calledWith(rendered, sinon.match.any));
				}
			});
		});

		it("should send 500 when an error occurs", function() {
			return _run({
				readFile: sinon.stub(fs, "readFileAsync").rejects(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		it("should set developer issue count", function() {
			var userId = "the user id";
			var users = [{ _id: userId }];
			var issues = [{ developerId: userId }, { developerId: userId }];
			return _run({
				users: users,
				mapped: [{ name: "blah", id: userId }],
				issues: issues,
				assert: function(result) {
					assert(result.stubs.mustache.calledWith(sinon.match.any, { users: JSON.stringify([{ name: "blah", id: userId, developerIssueCount: issues.length, testerIssueCount: 0 }]) }));
				}
			});
		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/users",
				env: params.env,
				request: {
					project: { _id: params.projectId || "the project id" }
				},
				stubs: {
					readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html || "the html"),
					getIssues: sinon.stub(repositories.Issue, "get").resolves(params.issues || []),
					getUsers: sinon.stub(repositories.User, "get").resolves(params.users || []),
					mapAll: sinon.stub(mapper, "mapAll").resolves(params.mapped || []),
					mustache: sinon.stub(mustache, "render").returns(params.rendered || "the rendered html")
				},
				assert: params.assert
			});
		}
	});
});
