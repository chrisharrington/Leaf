require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapper");

var sut = require("../../controllers/issues");

describe("issues", function() {
	describe("issue-details", function() {
		it("should get issue details", function() {
			_runIssueDetails({});
		});

		it("should send 500 on when failing to read view", function() {
			_runIssueDetails({
				readFile: sinon.stub(fs, "readFileAsync").rejects(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get issue by number", function() {
			_runIssueDetails({
				issueNumber: sinon.stub(repositories.Issue, "number").rejects(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get transitions", function() {
			_runIssueDetails({
				transitionStatus: sinon.stub(repositories.Transition, "status").rejects(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get comments", function() {
			_runIssueDetails({
				commentIssue: sinon.stub(repositories.Comment, "issue").rejects(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get files", function() {
			_runIssueDetails({
				fileIssue: sinon.stub(repositories.IssueFile, "issue").rejects(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to map", function() {
			_runIssueDetails({
				mapperMap: sinon.stub(mapper, "map").throws(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		function _runIssueDetails(params) {
			params = params || {};
			var stubs = {
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.detailsContent || "details-content"),
				issueNumber: params.issueNumber || sinon.stub(repositories.Issue, "number").resolves(params.issue || {}),
				transitionStatus: params.transitionStatus || sinon.stub(repositories.Transition, "status").resolves(params.transitions || []),
				commentIssue: params.commentIssue || sinon.stub(repositories.Comment, "issue").resolves(params.comments || []),
				fileIssue: params.fileIssue || sinon.stub(repositories.IssueFile, "issue").resolves(params.files || []),
				mapperMap: params.mapperMap || sinon.stub(mapper, "map").returns(params.mapped || {})
			};

			params.verb = "get";
			params.route = "/issues/details";
			params.request = {
				query: {
					projectId: params.projectId || "the project id"
				}
			};

			return _run(params).finally(function() {
				for (var name in stubs)
					stubs[name].restore();
			});
		}
	});

	describe("search-issues", function() {
		it("should set get /issues/list route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues/list", sinon.match.func, sinon.match.func));
		});

		it("should send 500 when failing to retrieve issues", function() {
			sinon.stub(repositories.Issue, "search").rejects();

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
					repositories.Issue.search.restore();
				}
			}).finally(function() {

			});
		});

		it("should send 500 when failing to map issues", function() {
			sinon.stub(repositories.Issue, "search").resolves(["blah"]);
			sinon.stub(mapper, "mapAll").throws();

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
				mapper.mapAll.restore();
			});
		});

		it("should set start to 1 when invalid start given", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			request.start = "not a number";
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, 1, parseInt(request.query.end)));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		it("should set end to 50 when invalid start given", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			request.end = "not a number";
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, parseInt(request.query.start), 50));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		it("should map issues to view models", function() {
			sinon.stub(repositories.Issue, "search").resolves(["blah"]);
			sinon.stub(mapper, "mapAll").returns([]);

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(mapper.mapAll.calledWith("issue", "issue-view-model", ["blah"]));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
				mapper.mapAll.restore();
			});
		});

		it("should search for issues", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, parseInt(request.query.start), parseInt(request.query.end)));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		function _buildDefaultRequest() {
			return {
				query: {
					start: "1",
					end: "50",
					priorities: "priority1",
					statuses: "status1",
					milestones: "milestone1",
					developers: "developer1",
					testers: "tester1",
					types: "type1",
					direction: "ascending",
					comparer: "priority"
				}
			};
		}
	});

	describe("get-issues", function() {
		it("should set get /issues route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues", sinon.match.func, sinon.match.func));
		});

		it("should read issues.html file contents", function() {
			var content = "issues.html content";
			sinon.stub(fs, "readFileAsync").resolves(content);

			return _run({
				verb: "get",
				route: "/issues",
				assert: function() { assert(fs.readFileAsync.calledWith("public/views/issues.html")); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});

		it("should send contents of issues.html via response", function() {
			var content = "issues.html content";
			sinon.stub(fs, "readFileAsync").resolves(content);

			return _run({
				verb: "get",
				route: "/issues",
				assert: function(stubs) { assert(stubs.response.send.calledWith(content)); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});

		it("should send 500 and error message on error", function() {
			var error = "oh noes! an error!";
			sinon.stub(fs, "readFileAsync").rejects(error);

			return _run({
				verb: "get",
				route: "/issues",
				assert: function(stubs) { assert(stubs.response.send.calledWith("Error while reading issues view: Error: " + error, 500)); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});
	});

	function _run(params) {
		var func;
		var request = params.request || sinon.stub(), response = { send: sinon.stub() };
		var app = {
			get: function(route, b, c) {
				if (params.verb == "get" && route == params.route)
					if (c) func = c; else func = b;
			},
			post: function(route, b, c) {
				if (params.verb == "post" && route == params.route)
					if (c) func = c; else func = b;
			}
		};

		sut(app);
		return func(request, response).finally(function() {
			if (params.assert)
				params.assert({ request: request, response: response });
		});
	}
});