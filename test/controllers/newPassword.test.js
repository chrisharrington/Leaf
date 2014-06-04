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
});