var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var fs = Promise.promisifyAll(require("fs"));
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapping/mapper");
var mustache = require("mustache");
var emailer = require("../../email/emailer");
var csprng = require("csprng");
var config = require("../../config");
var mongoose = require("mongoose");

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
				readFile: sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!")),
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

	describe("post /users/create", function() {
		it("should set post /users/create route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/users/create", sinon.match.func));
		});

		it("should send 400 with missing name", function() {
			_run({
				body: {
					emailAddress: "the email address"
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The name is required.", 400));
				}
			})
		});

		it("should send 400 with empty name", function() {
			_run({
				body: {
					name: "",
					emailAddress: "the email address"
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The name is required.", 400));
				}
			})
		});

		it("should send 400 with missing email address", function() {
			_run({
				body: {
					name: "the name"
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The email address is required.", 400));
				}
			})
		});

		it("should send 400 with empty email address", function() {
			_run({
				body: {
					name: "the name",
					emailAddress: ""
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The email address is required.", 400));
				}
			});
		});

		it("should send 400 with invalid email address", function() {
			_run({
				body: {
					name: "the name",
					emailAddress: "faasdfasf"
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The email address is invalid.", 400));
				}
			});
		});

		it("should generate activation token", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.csprng.calledWith(sinon.match.any, 128, 36));
				}
			});
		});

		it("should map user-view-model to user", function() {
			var name = "the name", email = "blah@blah.com";
			return _run({
				body: {
					name: name,
					emailAddress: email
				},
				assert: function(result) {
					assert(result.stubs.mapper.calledWith("user-view-model", "user", { name: name, emailAddress: email }));
				}
			});
		});

		it("should create new user id", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.objectId.calledWith());
				}
			});
		});

		it("should create new user", function() {
			var mapped = { name: "blah!" };
			return _run({
				mapped: mapped,
				assert: function(result) {
					assert(result.stubs.createUser.calledWith(mapped));
				}
			});
		});

		it("should send email", function() {
			var project = "the project name", domain = "http://the-domain.com", token = "the-token", name = "the name", emailAddress = "boo@blah.com";
			var user = { name: name, emailAddress: emailAddress, projectName: project, activationUrl: domain + "/users/activate/" + token };
			return _run({
				body: {
					name: name,
					emailAddress: emailAddress
				},
				domain: domain,
				token: token,
				projectName: "the project name",
				assert: function(result) {
					assert(result.stubs.email.calledWith(process.cwd() + "/email/templates/newUser.html", { user: user }, user.emailAddress, "Welcome to Leaf!"));
				}
			});
		});

		it("should send created user id", function() {
			var id = "the id";
			return({
				id: id,
				assert: function(result) {
					assert(result.response.send.calledWith(id, sinon.match.any));
				}
			});
		});

		it("should send 200", function() {
			return({
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			});
		});

		it("should send 500 on error", function() {
			return _run({
				projectName: "blah",
				csprng: sinon.stub(csprng, "call").throws(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/users/create",
				request: {
					project: {
						name: params.projectName,
						_id: params.projectId || "the project id"
					},
					body: params.body || {
						name: "the name",
						emailAddress: "blah@blah.com"
					}
				},
				stubs: {
					csprng: params.csprng || sinon.stub(csprng, "call").returns(params.token || "the token"),
					mapper: sinon.stub(mapper, "map").resolves(params.mapped || {}),
					createUser: sinon.stub(repositories.User, "create").resolves(),
					email: sinon.stub(emailer, "send").resolves(),
					objectId: sinon.stub(mongoose.Types, "ObjectId").returns(params.id || "the id"),
					config: sinon.stub(config, "call").returns(params.domain || "the domain")
				},
				assert: params.assert
			});
		}
	});
});
