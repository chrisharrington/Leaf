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
var crypto = require("crypto");
var config = require("../../config");
var mongoose = require("mongoose");
var baseController = require("../../controllers/baseController");
var hash = require("../../authentication/hash");

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
					assert(result.stubs.getIssues.calledWith(projectId));
				}
			});
		});

		it("should get users sorted by name ascending", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.getUsers.calledWith(null, { sort: { name: 1 }}));
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

		it("should set developer and tester issue count", function() {
			var userId = "the user id";
			var users = [{ _id: userId }];
			var issueCounts = {};
			issueCounts[userId] = { developer: 10, tester: 20 };
			return _run({
				users: users,
				mapped: [{ name: "blah", id: userId }],
				issueCounts: issueCounts,
				assert: function(result) {
					assert(result.stubs.mustache.calledWith(sinon.match.any, { users: JSON.stringify([{ name: "blah", id: userId, developerIssueCount: 10, testerIssueCount: 20 }]) }));
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
					getIssues: sinon.stub(repositories.Issue, "issueCountsPerUser").resolves(params.issueCounts || []),
					getUsers: sinon.stub(repositories.User, "get").resolves(params.users || []),
					mapAll: sinon.stub(mapper, "mapAll").resolves(params.mapped || []),
					mustache: sinon.stub(mustache, "render").returns(params.rendered || "the rendered html")
				},
				assert: params.assert
			});
		}
	});

	describe("get /users/profile", function() {
		it("should set get /users/profile route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/users/profile", sinon.match.func));
		});

		it("should call base.view with 'public/views/profile.html'", function() {
			var view = sinon.stub(baseController, "view");
			return base.testRoute({
				verb: "get",
				route: "/users/profile",
				sut: sut,
				stubs: { base: view },
				assert: function(result) {
					assert(view.calledWith("public/views/profile.html", sinon.match.any));
				}
			})
		});

		it("should call base.view with response", function() {
			var view = sinon.stub(baseController, "view");
			return base.testRoute({
				verb: "get",
				route: "/users/profile",
				sut: sut,
				stubs: { base: view },
				assert: function(result) {
					assert(view.calledWith(sinon.match.any, result.response));
				}
			})
		});
	});

	describe("post /users/profile", function() {
		it("should set post /users/profile route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/users/profile", sinon.match.func));
		});

		it("should map user from request.body", function() {
			var body = { name: "the incoming user's name" };
			return _run({
				body: body,
				assert: function(result) {
					assert(result.stubs.mapper.calledWith("user-view-model", "user", body));
				}
			});
		});

		it("should save mapped user", function() {
			var mapped = { name: "the mapped name" };
			return _run({
				mapped: mapped,
				assert: function(result) {
					assert(result.stubs.save.calledWith(mapped));
				}
			});
		});

		it("should send 200", function() {
			return _run({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 with error", function() {
			return _run({
				mapper: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		it("should not generate new password when no password is given", function() {
			var mapped = { name: "the mapped name", password: undefined };
			return _run({
				mapped: mapped,
				assert: function(result) {
					assert(result.stubs.hash.notCalled);
				}
			});
		});

		it("should generate new salt when password is given", function() {
			return _run({
				password: "not undefined",
				assert: function(result) {
					assert(result.stubs.csprng.calledWith(sinon.match.any, 512, 36));
				}
			});
		});

		it("should generate new password when password is given", function() {
			var salt = "the salt", password = "secret password";
			return _run({
				salt: salt,
				password: password,
				assert: function(result) {
					assert(result.stubs.hash.calledWith(sinon.match.any, salt + password));
				}
			});
		});

		it("should save user with generated password when password is given", function() {
			var salt = "the salt", password = "secret password", hash = "the hash";
			return _run({
				salt: salt,
				password: password,
				hash: hash,
				assert: function(result) {
					assert(result.stubs.save.calledWith({ salt: salt, password: hash }));
				}
			});
		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/users/profile",
				request: {
					project: {
						name: params.projectName,
						_id: params.projectId || "the project id"
					},
					body: params.body || {
						password: params.password,
						name: "the name",
						emailAddress: "blah@blah.com"
					}
				},
				stubs: {
					mapper: params.mapper || sinon.stub(mapper, "map").resolves(params.mapped || {}),
					csprng: params.csprng || sinon.stub(csprng, "call").returns(params.salt || "the salt"),
					hash: sinon.stub(hash, "call").returns(params.hash || "the hash"),
					save: sinon.stub(repositories.User, "save").resolves()
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
			});
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
			});
		});

		it("should send 400 with missing email address", function() {
			_run({
				body: {
					name: "the name"
				},
				assert: function(result) {
					assert(result.response.send.calledWith("The email address is required.", 400));
				}
			});
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

	describe("post /users/delete", function() {
		it("should set post /users/delete route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/users/delete", sinon.match.func));
		});

		it("should send 400 with missing id", function() {
			_run({
				idMissing: true,
				assert: function(result) {
					assert(result.response.send.calledWith("Unable to delete user; no ID was provided.", 400));
				}
			});
		});

		it("should call remove with the given id", function() {
			var id = "the id";
			return _run({
				id: id,
				assert: function(result) {
					assert(result.stubs.remove.calledWith(id));
				}
			});
		});

		it("should send 200 on success", function() {
			return _run({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 on failure", function() {
			return _run({
				remove: sinon.stub(repositories.User, "remove").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		it("should not call remove when no id is found", function() {
			_run({
				idMissing: true,
				assert: function(result) {
					assert(result.stubs.remove.notCalled);
				}
			});
		});

		function _run(params) {
			params || {};
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/users/delete",
				request: {
					body: {
						id: params.idMissing ? undefined : params.id || "the id"
					}
				},
				stubs: {
					remove: params.remove || sinon.stub(repositories.User, "remove").resolves()
				},
				assert: params.assert
			});
		}
	});

	describe("post /users/change-password", function() {
		it("should set post /users/change-password route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/users/change-password", sinon.match.func));
		});

		it("should send 400 with missing current password", function() {
			_run({
				password: "the password",
				confirmed: "the confirmed password",
				assert: function(result) {
					assert(result.response.send.calledWith("The current password is missing.", 400));
				}
			});
		});

		it("should send 400 with missing new password", function() {
			_run({
				current: "the current password",
				confirmed: "the confirmed password",
				assert: function(result) {
					assert(result.response.send.calledWith("The new password is missing.", 400));
				}
			});
		});

		it("should send 400 with missing confirmed password", function() {
			_run({
				current: "the current password",
				password: "the password",
				assert: function(result) {
					assert(result.response.send.calledWith("The confirmed password is missing.", 400));
				}
			});
		});

		it("should send 400 when new and confirmed passwords don't match", function() {
			_run({
				current: "the current password",
				password: "the password",
				confirmed: "the confirmed password",
				assert: function(result) {
					assert(result.response.send.calledWith("The new and confirmed passwords don't match.", 400));
				}
			});
		});

		it("should send 400 when given current password doesn't match stored current password", function() {
			_run({
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				hash: "the hash",
				assert: function(result) {
					assert(result.response.send.calledWith("The current password is incorrect.", 400));
				}
			});
		});

		it("should calculate hash using salt and given current password", function() {
			_run({
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				salt: "the salt",
				stored: "the stored password",
				hash: "the hash",
				assert: function(result) {
					assert(result.stubs.update.calledWith("the saltthe current password"));
				}
			});
		});

		it("should calculate hash using algorithm read from config", function() {
			_run({
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				salt: "the salt",
				stored: "the stored password",
				hash: "the hash",
				algorithm: "the algorithm",
				assert: function(result) {
					assert(result.stubs.crypto.calledWith("the algorithm"));
				}
			});
		});

		it("should calculate hash using a hex digest", function() {
			_run({
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				salt: "the salt",
				stored: "the stored password",
				hash: "the hash",
				algorithm: "the algorithm",
				assert: function(result) {
					assert(result.stubs.digest.calledWith("hex"));
				}
			});
		});

		it("should send 200", function() {
			return _run({
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				salt: "the salt",
				stored: "the stored password",
				hash: "the stored password",
				algorithm: "the algorithm",
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 on error", function() {
			return _run({
				userUpdate: sinon.stub(repositories.User, "update").rejects(new Error("oh noes!")),
				current: "the current password",
				password: "the password",
				confirmed: "the password",
				salt: "the salt",
				stored: "the stored password",
				hash: "the stored password",
				algorithm: "the algorithm",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		function _run(params) {
			params || {};

			var stubs = {};
			stubs.config = sinon.stub(config, "call").returns(params.algorithm || "the hash algorithm");
			stubs.crypto = sinon.stub(crypto, "createHash").returns({ update: stubs.update = sinon.stub().returns({ digest: stubs.digest = sinon.stub().returns(params.hash) }) });
			stubs.userUpdate = params.userUpdate || sinon.stub(repositories.User, "update").resolves();
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/users/change-password",
				request: {
					body: {
						current: params.current,
						password: params.password,
						confirmed: params.confirmed
					},
					user: {
						password: params.stored,
						salt: params.salt
					}
				},
				stubs: stubs,
				assert: params.assert
			});
		}
	});
});
