var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/caches/baseCache");

describe("baseCache", function() {
	describe("init", function () {
		it("should call repository.get", function() {
			sut.repository = { get: sinon.stub().resolves([]) };

			return sut.init().then(function() {
				assert(sut.repository.get.calledOnce);
			});
		});

		it("should place every model retrieved from repository.get into the cache, keyed by _id", function() {
			sut.repository = { get: sinon.stub().resolves([
				{ _id: "first" },
				{ _id: "second" }
			])};

			return sut.init().then(function() {
				assert(sut.cache["first"]._id == "first");
				assert(sut.cache["second"]._id == "second");
			});
		});
	});

	describe("all", function() {
		it("should generated a list from all of the cached objects and return it", function() {
			sut.cache = {
				"first": { _id: "first" },
				"second": { _id: "second" }
			};

			return sut.all().then(function(list) {
				assert(list[0]._id == "first");
				assert(list[1]._id == "second");
			});
		})
	});

	describe("details", function() {
		it("should retrieve previously cached", function() {
			sut.cache = {
				"blah": "boo"
			};

			return sut.details("blah").then(function(result) {
				assert(result == "boo");
			});
		});

		it("should fail with no such key", function() {
			sut.cache = {
				"blah": "boo"
			};

			var failed = false;
			return sut.details("no such key").catch(function() {
				failed = true;
			}).finally(function() {
				assert(failed);
			});
		});
	});
});