require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var bundler = Promise.promisifyAll(require("../../bundling/bundler"));
var assets = require("../../bundling/assets");
var controller = require("../../controllers/baseController");
var config = require("../../config");

var sut = require("../../controllers/project");

describe("style", function() {
	describe("get /project/settings", function() {
		it("should set get /project/settings route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/project/settings", sinon.match.func));
		});

		it("should call base.view with 'public/views/project.html'", function() {
			var view = sinon.stub(controller, "view");
			return base.testRoute({
				verb: "get",
				route: "/project/settings",
				sut: sut,
				assert: function() {
					assert(view.calledWith("public/views/project.html", sinon.match.any));
					view.restore();
				}
			});
		});

		it("should call base.view with 'public/views/project.html'", function() {
			var view = sinon.stub(controller, "view"), domain = "the domain", configDomain = sinon.stub(config, "call").returns(domain);
			return base.testRoute({
				verb: "get",
				route: "/project/settings",
				sut: sut,
				assert: function(result) {
					assert(view.calledWith(sinon.match.any, sinon.match.any, {
						domain: domain
					}));
					view.restore();
					configDomain.restore();
				}
			});
		});

		function _run(params) {
			params = params || {};
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/project/settings",
				env: params.env,
				assert: params.assert
			});
		}
	});
});