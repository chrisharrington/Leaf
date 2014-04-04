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

			_run({ verb: "get", route: "/issues" });

			assert(fs.readFileAsync.calledWith("public/views/issues.html"));
		});

		function _run(params) {
			var request = sinon.stub(), response = sinon.stub();
			var app = {
				get: function(route, b, c) {
					if (params.verb == "get" && route == params.route)
						if (c) c(request, response); else b(request, response);
				},
				post: function(route, b, c) {
					if (params.verb == "post" && route == params.route)
						if (c) c(request, response); else b(request, response);
				}
			};

			sut(app);
			return { request: request, response: response };
		}
	});
});