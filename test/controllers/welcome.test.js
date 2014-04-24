require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), base = require("./base.test"), extend = require("node.extend");
var fs = Promise.promisifyAll(require("fs"));
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapping/mapper");
var mongoose = require("mongoose");
var crypto = require("crypto");
var config = require("../../config");
var csprng = sinon.stub();
var proxyquire = require("proxyquire");

var sut = proxyquire("../../controllers/welcome", {
	"csprng": csprng
});

describe("welcome controller", function() {
	describe("get /welcome", function() {
		it("should set get /welcome route", function () {
			base.testRouteExists(sut, "get", "/welcome", true);
		});

		it("should send 200", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/welcome",
				stubs: {
					readFile: sinon.stub(fs, "readFileAsync").resolves("the file contents")
				},
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			});
		});

		it("should send contents of file", function() {
			var fileContents = "the file contents";
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/welcome",
				stubs: {
					readFile: sinon.stub(fs, "readFileAsync").resolves(fileContents)
				},
				assert: function(result) {
					assert(result.response.send.calledWith(fileContents, 200));
				}
			});
		});

		it("should read contents of public/views/welcome.html", function() {
			var fileContents = "the file contents";
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/welcome",
				stubs: {
					readFile: sinon.stub(fs, "readFileAsync").resolves(fileContents)
				},
				assert: function(result) {
					assert(result.stubs.readFile.calledWith("public/views/welcome.html"));
				}
			});
		});

		it("should read contents of public/views/welcome.html", function() {
			var fileContents = "the file contents";
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/welcome",
				stubs: {
					readFile: sinon.stub(fs, "readFileAsync").resolves(fileContents)
				},
				assert: function(result) {
					assert(result.stubs.readFile.calledWith("public/views/welcome.html"));
				}
			});
		});

		it("should send 500 when failing to read contents of public/issues/welcome.html", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/welcome",
				stubs: {
					readFile: sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!"))
				},
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});
	});

	describe("post /sign-in", function() {
		it("should send 200", function() {
			return _run({
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			});
		});

		it("should send 500 when failing to retrieve user", function() {
			return _run({
				userGetOne: sinon.stub(repositories.User, "one").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create a hash", function() {
			return _run({
				cryptoCreateHash: sinon.stub(crypto, "createHash").throws(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to map", function() {
			return _run({
				mapperMap: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to update user", function() {
			return _run({
				userUpdate: sinon.stub(repositories.User, "update").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 401 when no user with given email address found", function() {
			return _run({
				noUserFound: true,
				assert: function(result) {
					assert(result.response.send.calledWith(401));
				}
			});
		});

		it("should send 401 when hashed password doesn't equal saved password", function() {
			return _run({
				digestPassword: "definitely not the existing password",
				assert: function(result) {
					assert(result.response.send.calledWith(401));
				}
			});
		});

		it("should create new user session when user has no session", function() {
			return _run({
				session: "",
				assert: function(result) {
					assert(csprng.calledWith(512, 36));
				}
			});
		});

		it("should set user expiration to null when not staying signed in", function() {
			return _run({
				staySignedIn: false,
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("user", "user-view-model", {
						expiration: null,
						password: sinon.match.any,
						project: sinon.match.any,
						session: sinon.match.any
					}));
				}
			});
		});

		it("should set expires false on cookie when not staying signed in", function() {
			return _run({
				staySignedIn: false,
				assert: function(result) {
					assert(result.response.cookie.calledWith("session", sinon.match.string, { expires: false }));
				}
			});
		});

		it("should set max age on cookie when staying signed in", function() {
			return _run({
				assert: function(result) {
					assert(result.response.cookie.calledWith("session", sinon.match.string, { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 }));
				}
			});
		});

		it("should send mapped user", function() {
			var mappedUser = "the mapped user";
			return _run({
				mapperMap: sinon.stub(mapper, "map").resolves(mappedUser),
				assert: function(result) {
					assert(result.response.send.calledWith({ user: mappedUser, project: sinon.match.any }, 200));
				}
			})
		});

		it("should send mapped project", function() {
			var mappedProject = "the mapped project";
			return _run({
				mapperMap: sinon.stub(mapper, "map").resolves(mappedProject),
				assert: function(result) {
					assert(result.response.send.calledWith({ user: sinon.match.any, project: mappedProject }, 200));
				}
			})
		});

		function _run(params) {
			params = params || {};
			var hash = {
				update: function() {
					return {
						digest: function() { return params.digestPassword || "the password"; }
					}
				}
			};
			return base.testRoute(extend({
				sut: sut,
				verb: "post",
				route: "/sign-in",
				request: {
					body: {
						email: params.email || "the email",
						password: params.password || "the password",
						staySignedIn: params.staySignedIn == undefined ? "true" : params.staySignedIn
					}
				},
				stubs: {
					userGetOne: params.userGetOne || sinon.stub(repositories.User, "one").resolves(params.noUserFound ? undefined : params.userGetOneResult || { password: params.password || "the password", session: params.session == undefined || params.session != "" ? "the session" : undefined, expiration: params.expiration || "the expiration", project: params.project || {}}),
					cryptoCreateHash: params.cryptoCreateHash || sinon.stub(crypto, "createHash").returns(params.hash || hash),
					dateNow: params.dateNow || sinon.stub(Date, "now").returns(params.date || Date.now()),
					mapperMap: params.mapperMap || sinon.stub(mapper, "map"),
					userUpdate: params.userUpdate || sinon.stub(repositories.User, "update").resolves(),
					getProject: params.getProject || sinon.stub(repositories.Project, "one").resolves({})
				}
			}, params));
		}
	});
});
