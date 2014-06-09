require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var bundler = Promise.promisifyAll(require("../../bundling/bundler"));
var assets = require("../../bundling/assets");
var controller = require("../../controllers/baseController");
var config = require("../../config");
var csprng = require("csprng");
var crypto = require("../../authentication/crypto");
var repositories = require("../../data/repositories");

var sut = require("../../controllers/newPassword");

describe("newPassword", function() {
	describe("get /new-password", function () {
		it("should set get /new-password route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/new-password", sinon.match.func));
		});

		it("should call base.view with 'public/views/newPassword.html'", function () {
			var view = sinon.stub(controller, "view");
			return base.testRoute({
				verb: "get",
				route: "/new-password",
				sut: sut,
				assert: function () {
					assert(view.calledWith("public/views/newPassword.html", sinon.match.any));
					view.restore();
				}
			});
		});
	});

	describe("post /new-password", function() {
		it("should set post /new-password route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/new-password", sinon.match.func, sinon.match.func));
		});

		it("should find user based on email address and new password token", function() {
			var email = "the email address", token = "the token";
			return _run({
				email: email,
				token: token,
				assert: function(result) {
					assert(result.stubs.userOne.calledWith({ emailAddress: email, newPasswordToken: token }));
				}
			});
		});

		it("should send 401 if no user found", function() {
			return _run({
				assert: function(result) {
					assert(result.response.send.calledWith(401));
				}
			});
		});

		it("should not update user if no user found", function() {
			return _run({
				assert: function (result) {
					assert(result.stubs.userUpdate.notCalled);
				}
			});
		});

		it("should generate salt", function() {
			var user = { name: "the user's name" };
			return _run({
				user: user,
				assert: function(result) {
					assert(result.stubs.csprng.calledWith(sinon.match.any, 128, 36));
				}
			});
		});

		it("should generate password hash using the salt and the body's password", function() {
			var user = { name: "the user's name" }, salt = "the generated salt", password = "the body password";
			return _run({
				user: user,
				salt: salt,
				password: password,
				assert: function(result) {
					assert(result.stubs.createHash.calledWith(salt + password));
				}
			});
		});

		it("should update user with newly generated salt", function() {
			var user = { name: "the user's name" }, salt = "a new salt";
			return _run({
				user: user,
				salt: salt,
				assert: function(result) {
					assert(result.stubs.userUpdate.calledWith({ name: user.name, salt: salt, password: sinon.match.any, newPasswordToken: sinon.match.any }));
				}
			});
		});

		it("should update user with newly generated password", function() {
			var user = { name: "the user's name" }, password = "the new password";
			return _run({
				user: user,
				hash: password,
				assert: function(result) {
					assert(result.stubs.userUpdate.calledWith({ name: user.name, salt: sinon.match.any, password: password, newPasswordToken: sinon.match.any }));
				}
			});
		});

		it("should update user with newPasswordToken set to null", function() {
			var user = { name: "the user's name" }, password = "the new password";
			return _run({
				user: user,
				hash: password,
				assert: function(result) {
					assert(result.stubs.userUpdate.calledWith({ name: user.name, salt: sinon.match.any, password: sinon.match.any, newPasswordToken: null }));
				}
			});
		});

		it("should send 200", function() {
			return _run({
				user: { name: "the user's name" },
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 with error", function() {
			return _run({
				user: { name: "the user's name" },
				userUpdate: sinon.stub(repositories.User, "update").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		function _run(params) {
			params || {};

			var stubs = {};
			stubs.userOne = params.userOne || sinon.stub(repositories.User, "one").resolves(params.user);
			stubs.csprng = params.csprng || sinon.stub(csprng, "call").returns(params.salt || "the salt");
			stubs.createHash = params.createHash || sinon.stub(crypto, "hash").returns(params.hash || "the hash");
			stubs.userUpdate = params.userUpdate || sinon.stub(repositories.User, "update").resolves();
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/new-password",
				request: {
					body: {
						email: params.email,
						token: params.token,
						password: params.password,
						userId: params.userId
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