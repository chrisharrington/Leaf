var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

describe("array extensions", function() {
	describe("toDictionary", function() {
		it("should key with id when no key provided", function() {
			var dict = _buildTestArray().toDictionary();
			assert.equal(dict["1"].length, 1);
			assert.equal(dict["1"][0].name, "the first name");
			assert.equal(dict["2"].length, 1);
			assert.equal(dict["2"][0].name, "the second name");
			assert.equal(dict["3"].length, 1);
			assert.equal(dict["3"][0].name, "the third name");
		});

		it("should group keyed items in single array", function() {
			var dict = _buildTestArray().toDictionary(function(x) { return x.group; });
			assert.equal(dict["1"].length, 2);
			assert.equal(dict["1"][0].name, "the first name");
			assert.equal(dict["1"][1].name, "the second name");
			assert.equal(dict["2"].length, 1);
			assert.equal(dict["2"][0].name, "the third name");
		});

		it("should return an empty object when keyed by undefined property", function() {
			assert(_isEmpty(_buildTestArray().toDictionary(function(x) { return x.blah; })));
		});
	});

	describe("toUniqueDictionary", function() {
		it("should key with id when no key provided", function() {
			var result = _buildTestArray().toUniqueDictionary();
			assert.equal(result["1"].name, "the first name");
			assert.equal(result["2"].name, "the second name");
			assert.equal(result["3"].name, "the third name");
		});

		it("should overwrite values when duplicate key given", function() {
			var result = _buildTestArray().toUniqueDictionary(function(x) { return x.group; });
			assert.equal(result["1"].name, "the second name");
			assert.equal(result["2"].name, "the third name");
		});

		it("should return an empty object when keyed by undefined property", function() {
			var blah = _buildTestArray().toUniqueDictionary(function(x) { return x.blah; });
			assert(_isEmpty(blah));
		});
	});

	function _isEmpty(obj) {
		for(var name in obj)
			if (obj.hasOwnProperty(name))
				return false;
		return true;
	}

	function _buildTestArray() {
		return [
			{ id: 1, name: "the first name", group: 1 },
			{ id: 2, name: "the second name", group: 1 },
			{ id: 3, name: "the third name", group: 2 }
		];
	}
});