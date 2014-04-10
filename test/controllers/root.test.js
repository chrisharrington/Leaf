require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapper");
var scriptBundler = require("../../bundling/scriptBundler");
var styleBundler = require("../../bundling/styleBundler");
var mustache = require("mustache");

var fs = Promise.promisifyAll(require("fs"));

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

		it("should map statuses to status view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("status", "status-view-model", sinon.match.any));
				}
			})
		});

		it("should map users to user view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("user", "user-view-model", sinon.match.any));
				}
			})
		});

		it("should map transitions to transition view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("transition", "transition-view-model", sinon.match.any));
				}
			})
		});

		it("should map projects to project view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("project", "project-view-model", sinon.match.any));
				}
			})
		});

		it("should map milestones to milestone view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("milestone", "milestone-view-model", sinon.match.any));
				}
			})
		});

		it("should map issue types to issue type view models", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("issue-type", "issue-type-view-model", sinon.match.any));
				}
			})
		});

		it("should map signed in user to user view model", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					user: "a user"
				}),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("user", "user-view-model", sinon.match.any));
				}
			})
		});

		it("should map signed in user to user view model", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					user: "a user"
				}),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("user", "user-view-model", sinon.match.any));
				}
			})
		});

		it("should map signed in user's project to project view model", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("project", "project-view-model", sinon.match.any));
				}
			})
		});

		it("should map signed in user's project to project view model", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("project", "project-view-model", sinon.match.any));
				}
			});
		});

		it("should render html with mustache before sending", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.mustacheRender.calledWith("the html", {
						priorities: sinon.match.string,
						statuses: sinon.match.string,
						users: sinon.match.string,
						transitions: sinon.match.string,
						projects: sinon.match.string,
						milestones: sinon.match.string,
						issueTypes: sinon.match.string,
						signedInUser: sinon.match.string,
						selectedProject: sinon.match.any,
						renderedScripts: sinon.match.string,
						renderedCss: sinon.match.string
					}));
				}
			});
		});

		it("should set user when not expired", function() {
			var user = {
				blah: "boo"
			};
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					user: user
				}),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("user", "user-view-model", user));
				}
			});
		});

		it("should set user null when expired", function() {
			var date = Date.now();
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					date: date,
					user: {
						expiration: date - 1000
					}
				}),
				assert: function(result) {
					assert(result.stubs.mustacheRender.calledWith(sinon.match.any, {
						priorities: sinon.match.any,
						statuses: sinon.match.any,
						users: sinon.match.any,
						transitions: sinon.match.any,
						projects: sinon.match.any,
						milestones: sinon.match.any,
						issueTypes: sinon.match.any,
						signedInUser: "null",
						selectedProject: sinon.match.any,
						renderedScripts: sinon.match.any,
						renderedCss: sinon.match.any
					}));
				}
			});
		});

		it("should set null project when no user", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					userGetOne: sinon.stub(repositories.User, "one").resolves()
				}),
				assert: function(result) {
					assert(result.stubs.mustacheRender.calledWith(sinon.match.any, {
						priorities: sinon.match.any,
						statuses: sinon.match.any,
						users: sinon.match.any,
						transitions: sinon.match.any,
						projects: sinon.match.any,
						milestones: sinon.match.any,
						issueTypes: sinon.match.any,
						signedInUser: sinon.match.any,
						selectedProject: "null",
						renderedScripts: sinon.match.any,
						renderedCss: sinon.match.any
					}));
				}
			});
		});

		it("should set selectedProject to null when no user", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					userGetOne: sinon.stub(repositories.User, "one").resolves()
				}),
				assert: function(result) {
					assert(result.stubs.mustacheRender.calledWith(sinon.match.string, {
						priorities: sinon.match.string,
						statuses: sinon.match.string,
						users: sinon.match.string,
						transitions: sinon.match.string,
						projects: sinon.match.string,
						milestones: sinon.match.string,
						issueTypes: sinon.match.string,
						signedInUser: sinon.match.any,
						selectedProject: "null",
						renderedScripts: sinon.match.string,
						renderedCss: sinon.match.string
					}))
				}
			});
		});

		it("should send 500 on failed repository get call", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					priorities: sinon.stub(repositories.Priority, "get").rejects()
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on failed mapping", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					mapperMapAll: sinon.stub(mapper, "mapAll").rejects()
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on failed file read", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					readFile: sinon.stub(fs, "readFileAsync").rejects()
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on failed script bundle", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					scriptBundler: sinon.stub(scriptBundler, "render").rejects()
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on failed style bundle", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs({
					styleBundler: sinon.stub(styleBundler, "render").rejects()
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should get priorities in descending 'order' order", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.priorities.calledWith(null, { sort: { order: -1 }}));
				}
			});
		});

		it("should get statuses in ascending 'order' order", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.statuses.calledWith(null, { sort: { order: 1 }}));
				}
			});
		});

		function _buildStubs(params) {
			params = params || {};
			var stubs = {
				date: sinon.stub(Date, "now").returns(params.date || Date.now()),
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves("the html"),
				priorities: params.priorities || sinon.stub(repositories.Priority, "get").resolves([]),
				statuses: sinon.stub(repositories.Status, "get").resolves([]),
				users: sinon.stub(repositories.User, "get").resolves([]),
				transition: sinon.stub(repositories.Transition, "get").resolves([]),
				project: sinon.stub(repositories.Project, "get").resolves([]),
				milestones: sinon.stub(repositories.Milestone, "get").resolves([]),
				types: sinon.stub(repositories.IssueType, "get").resolves([]),
				signedInUser: params.userGetOne || sinon.stub(repositories.User, "one").resolves(params.user || "a user"),
				mapperMapAll: params.mapperMapAll || sinon.stub(mapper, "mapAll").resolves([]),
				mapperMap: sinon.stub(mapper, "map"),
				scriptBundler: params.scriptBundler || sinon.stub(scriptBundler, "render").resolves("the bundled scripts"),
				styleBundler: params.styleBundler || sinon.stub(styleBundler, "render").resolves("the bundled styles"),
				mustacheRender: sinon.stub(mustache, "render").returns("")
			};
			stubs.mapperMap.withArgs("user", "user-view-model", sinon.match.any).resolves(params.noMappedUser ? undefined : {});
			stubs.mapperMap.withArgs("project", "project-view-model", sinon.match.any).resolves(params.noMappedProject ? undefined : {});
			return stubs;
		}
	});
});