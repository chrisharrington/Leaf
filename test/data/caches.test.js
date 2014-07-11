var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var sut = require("../../data/newCaches");

describe("caches", function() {
	describe("init", function() {
		it("should call init of every object in the cache list", function() {
			var stubs = [];
			for (var name in sut)
				if (name != "init")
					sut[name] = { init: sinon.stub() };

			sut.init();

			for (var name in sut)
				if (name != "init")
					assert(sut[name].init.calledOnce);
		});
	});
});