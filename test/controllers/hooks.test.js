var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	base = require("./base.test");
require("../setup");

var controller = require("../../controllers/baseController");
var models = require("../../data/models");
var mapper = require("../../data/mapping/mapper");

var sut = require("../../controllers/hooks");

describe("hooks", function() {
	describe("post /hook", function() {
		it("should set post /hook route", function () {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/hook", sinon.match.func));
		});
	});
});
