require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var bundler = Promise.promisifyAll(require("../../bundling/bundler"));
var assets = require("../../bundling/assets");
var repositories = require("../../data/repositories");

var sut = require("../../controllers/permissions");

describe("permissions", function() {
	describe("post /permissions", function () {
		it("should set post /permissions route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/permissions", sinon.match.func));
		});

		it("should remove user permissions for given user", function () {
			var userId = "the user id";
			return _run({
				userId: userId,
				permissionIds: [],
				assert: function(result) {
					assert(result.stubs.remove.calledWith(userId));
				}
			});
		});

		it("should add permissions for given user", function () {
			var userId = "the user id", permissions = ["the permission id"];
			return _run({
				userId: userId,
				permissionIds: permissions,
				assert: function(result) {
					assert(result.stubs.add.calledWith(userId, permissions))
				}
			});
		});

		it("should send 200", function() {
			return _run({
				permissionIds: [],
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 on error", function() {
			return _run({
				permissionIds: [],
				remove: sinon.stub(repositories.UserPermission, "removeAllForUser").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			});
		});

		it("should add permissions with empty array with no permission ids given", function() {
			return _run({
				assert: function(result) {
					assert(result.stubs.add.calledWith(sinon.match.any, []));
				}
			});
		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/permissions",
				env: params.env,
				stubs: {
					remove: params.remove || sinon.stub(repositories.UserPermission, "removeAllForUser").resolves(),
					add: sinon.stub(repositories.UserPermission, "addPermissionsForUser").resolves()
				},
				request: {
					body: {
						userId: params.userId,
						permissionIds: params.permissionIds
					}
				},
				assert: params.assert
			});
		}
	});
});