require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base.test");
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapping/mapper");
var scriptBundler = require("../../bundling/scriptBundler");
var mustache = require("mustache");
var caches = require("../../data/caches");

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
						renderedScripts: sinon.match.string
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
						renderedScripts: sinon.match.any
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
						renderedScripts: sinon.match.any
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
						renderedScripts: sinon.match.string
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
					users: sinon.stub(repositories.User, "get").rejects(new Error("oh noes!"))
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
					mapperMapAll: sinon.stub(mapper, "mapAll").rejects(new Error("oh noes!"))
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
					readFile: sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!"))
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
					scriptBundler: sinon.stub(scriptBundler, "render").rejects(new Error("oh noes!"))
				}),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should get cached priorities", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.priorities.calledWith());
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
					assert(result.stubs.statuses.calledWith());
				}
			});
		});

		it("should get milestones in ascending 'name' order", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.milestones.calledWith(null, { sort: { name: 1 }}));
				}
			});
		});

		it("should get issue types in ascending 'name' order", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				stubs: _buildStubs(),
				assert: function(result) {
					assert(result.stubs.types.calledWith());
				}
			});
		});

		it("should set project to 'Leaf' when host is localhost", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				host: "localhost",
				stubs: _buildStubs({
					projects: [{ name: "Leaf" }]
				}),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("project", "project-view-model", { name: "Leaf" }));
				}
			});
		});

		it("should set project to subdomain", function() {
			return base.testRoute({
				sut: sut,
				verb: "get",
				route: "/",
				request: {
					cookies: { session: "the session" }
				},
				host: "blah.boo.com",
				stubs: _buildStubs({
					projects: [{ name: "not the project i'm looking for" }, { name: "blah" }]
				}),
				assert: function(result) {
					assert(result.stubs.mapperMap.calledWith("project", "project-view-model", { name: "blah" }));
				}
			});
		});

		function _buildStubs(params) {
			params = params || {};
			var stubs = {
				date: sinon.stub(Date, "now").returns(params.date || Date.now()),
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves("the html"),
				priorities: params.priorities || sinon.stub(caches.Priority, "all").resolves([]),
				statuses: sinon.stub(caches.Status, "all").resolves([]),
				users: params.users || sinon.stub(repositories.User, "get").resolves([]),
				transition: sinon.stub(caches.Transition, "all").resolves([]),
				project: sinon.stub(repositories.Project, "get").resolves(params.projects || []),
				milestones: sinon.stub(repositories.Milestone, "get").resolves([]),
				types: sinon.stub(caches.IssueType, "all").resolves([]),
				signedInUser: params.userGetOne || sinon.stub(repositories.User, "one").resolves(params.user || "a user"),
				mapperMapAll: params.mapperMapAll || sinon.stub(mapper, "mapAll").resolves([]),
				mapperMap: sinon.stub(mapper, "map"),
				scriptBundler: params.scriptBundler || sinon.stub(scriptBundler, "render").resolves("the bundled scripts"),
				mustacheRender: sinon.stub(mustache, "render").returns("")
			};
			stubs.mapperMap.withArgs("user", "user-view-model", sinon.match.any).resolves(params.noMappedUser ? undefined : {});
			stubs.mapperMap.withArgs("project", "project-view-model", sinon.match.any).resolves(params.noMappedProject ? undefined : {});
			return stubs;
		}
	});
});