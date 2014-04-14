var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/mapping/mapper");

describe("mapper", function() {
	describe("define", function() {
		it("should add a definition", function() {
			sut.define("source", "destination", "definition");
			assert(Object.keys(sut.maps).length == 1);
		});

		it("should have key that combines the source and destination with a pipe", function() {
			var source = "source", dest = "destination";
			sut.define(source, dest, "definition");
			assert(Object.keys(sut.maps)[0] == source + "|" + dest);
		});

		it("should add the given definition", function() {
			var source = "source", dest = "destination", definition = { id: "the_id", name: "the_name" };
			sut.define(source, dest, definition);

			var maps = sut.maps;
			assert(maps[Object.keys(maps)] == definition);
		});
	});
});