var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var sut = require("../../controllers/search");

describe("users", function() {
	describe("get /search", function () {
		it("should set get /search route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/search", sinon.match.func));
		});
	});
});
