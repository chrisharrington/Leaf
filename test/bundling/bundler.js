require("../setup");
var assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories");
var sut = require("../../bundling/bundler");

describe("bundler", function() {
	describe("renderScripts", function() {
		it("should render script tags in developer mode", function(done) {
			sut.renderScripts(require("../../bundling/assets"));
		});
	});
});