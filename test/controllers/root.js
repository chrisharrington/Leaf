require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base");
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapper");
var scriptBundler = require("../../bundling/scriptBundler");
var styleBundler = require("../../bundling/styleBundler");

var sut = require("../../controllers/root");

describe("root", function() {
	describe("get /", function() {
		it("should set the get / route", function() {
			base.testRouteExists(sut, "get", "/", true);
		});

		it("should send 200", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			})
		});

		it("should map priorities to priority view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("priority", "priority-view-model", sinon.match.any));
				}
			})
		});

		function _buildStubs() {
			return {
				priorities: sinon.stub(repositories.Priority, "all").resolves([]),
				statuses: sinon.stub(repositories.Status, "all").resolves([]),
				users: sinon.stub(repositories.User, "all").resolves([]),
				transition: sinon.stub(repositories.Transition, "all").resolves([]),
				project: sinon.stub(repositories.Project, "all").resolves([]),
				milestones: sinon.stub(repositories.Milestone, "all").resolves([]),
				types: sinon.stub(repositories.IssueType, "all").resolves([]),
				signedInUser: sinon.stub(repositories.User, "getOne").resolves({}),
				mapperMapAll: sinon.stub(mapper, "mapAll").resolves([]),
				mapperMap: sinon.stub(mapper, "map").resolves({}),
				scriptBundler: sinon.stub(scriptBundler, "render").resolves("the bundled scripts"),
				styleBundler: sinon.stub(styleBundler, "render").resolves("the bundled styles")
			};
		}
	});
});