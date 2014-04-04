require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../controllers/issues");

describe("issues", function() {
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

		function _run(params) {
			var func;
			var request = sinon.stub(), response = { send: sinon.stub() };
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
			return func(request, response).then(function() {
				if (params.assert)
					params.assert({ request: request, response: response });
			});
		}
	});
});