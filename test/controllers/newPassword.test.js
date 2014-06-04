require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var bundler = Promise.promisifyAll(require("../../bundling/bundler"));
var assets = require("../../bundling/assets");
var controller = require("../../controllers/baseController");
var config = require("../../config");

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

		function _run(params) {
			params || {};

			var stubs = {};
			stubs.userOne = params.userOne || sinon.stub(repositories.User, "one").resolves(params.user || {});
			stubs.userUpdate = params.userUpdate || sinon.stub(repositories.User, "update").resolves();
			return base.testRoute({
				sut: sut,
				verb: "post",
				route: "/new-password",
				request: {
					body: {
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