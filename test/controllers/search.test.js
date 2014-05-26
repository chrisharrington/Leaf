var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var controller = require("../../controllers/baseController");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");

var sut = require("../../controllers/search");

describe("users", function() {
	describe("get /search", function() {
		it("should set get /search route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/search", sinon.match.func));
		});

		it("should call base.view with public/views/search.html", function() {
			var view = sinon.stub(controller, "view");
			return base.testRoute({
				verb: "get",
				route: "/search",
				sut: sut,
				assert: function() {
					assert(view.calledWith("public/views/search.html", sinon.match.any));
					view.restore();
				}
			});
		});
	});

	describe("get /search/query", function () {
		var _stubs;

		it("should set get /search/query route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/search/query", sinon.match.func));
		});

		it("should send mapped issues", function() {
			var mapped = [{ details: "the first details", description: "the first description", number: 10 }, { details: "the second details", description: "the second description", number: 11 }];
			return _run({
				mapped: mapped
			}).then(function() {
				assert(_stubs.response.send.calledWith({ issues: mapped }, sinon.match.any));
			});
		});

		it("should highlight found text values in details", function() {
			var text = "text";
			var mapped = [{
				details: "texty text",
				description: "blah blah blah"
			}];
			return _run({
				mapped: mapped,
				text: text
			}).then(function() {
				assert(_stubs.response.send.calledWith({ issues: [{ details: "<b>text</b>y <b>text</b>", description: "blah blah blah" }] }, sinon.match.any));
			});
		});

		it("should highlight found text values in description", function() {
			var text = "text";
			var mapped = [{
				description: "texty text",
				details: "blah blah blah"
			}];
			return _run({
				mapped: mapped,
				text: text
			}).then(function() {
				assert(_stubs.response.send.calledWith({ issues: [{ description: "<b>text</b>y <b>text</b>", details: "blah blah blah" }] }, sinon.match.any));
			});
		});

		it("should highlight nothing when no search values are found", function() {
			var text = "text";
			var mapped = [{
				description: "boo boo boo",
				details: "blah blah blah"
			}];
			return _run({
				mapped: mapped,
				text: text
			}).then(function() {
				assert(_stubs.response.send.calledWith({ issues: [{ description: "boo boo boo", details: "blah blah blah" }] }, sinon.match.any));
			});
		});

		it("should send 500 on error", function() {
			return _run({
				textSearch: sinon.stub(models.Issue, "textSearchAsync").rejects(new Error("oh noes!"))
			}).then(function() {
				assert(_stubs.response.send.calledWith(sinon.match.any, 500));
			});
		});

		it("should call text search with given text", function() {
			var query = "the query text";
			return _run({
				text: query
			}).then(function() {
				assert(_stubs.textSearch.calledWith(query))
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			var result = {
				results: [{ score: 1, obj: { name: "the data" }}]
			};

			params = params || {};
			_stubs = {};
			_stubs.textSearch = params.textSearch || sinon.stub(models.Issue, "textSearchAsync").resolves(params.issues || result);
			_stubs.map = sinon.stub(mapper, "mapAll").returns(params.mapped || [{ details: "the first details", description: "the first description", number: 10 }, { details: "the second details", description: "the second description", number: 11 }]);
			params.request = _stubs.request = { query: { text: params.text || "the text" }};
			params.response = _stubs.response = { send: sinon.stub() };

			var func, app = {
				get: function(route, b, c) {
					if (route == "/search/query")
						func = c;
				},
				post: function() {}
			};

			sut(app);
			return func(params.request, params.response);
		}
	});
});