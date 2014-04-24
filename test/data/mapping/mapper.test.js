var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var fs = Promise.promisifyAll(require("fs"));

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

		afterEach(function() {
			sut.maps = {};
		});
	});

	describe("map", function() {
		it("should reject when no source given", function() {
			var message;
			return _run().catch(function(e) {
				message = e;
			}).finally(function() {
				assert(message.toString() == "Error: Missing source while mapping.");
			});
		});

		it("should reject when no mapping definition found", function() {
			var message;
			return _run({
				source: {},
				sourceKey: "source",
				destinationKey: "destination"
			}).catch(function(e) {
				message = e;
			}).finally(function() {
				assert(message == "Error: No such mapping definition for \"source|destination\"");
			});
		});

		it("should map all properties", function() {
			sut.maps = { "source|destination": { id: "the-id", name: "the-name" } };
			var source = { "the-id": 12345, "the-name": "boogity!" };

			return sut.map("source", "destination", source).then(function(mapped) {
				assert(mapped.id == source["the-id"]);
				assert(mapped.name == source["the-name"]);
			});
		});

		it("should execute defined functions", function() {
			sut.maps = { "source|destination": { id: "the-id", name: "the-name", formattedName: function(m) { return m["the-name"].toUpperCase(); } } };
			var source = { "the-id": 12345, "the-name": "boogity!" };

			return sut.map("source", "destination", source).then(function(mapped) {
				assert(mapped.formattedName == source["the-name"].toUpperCase());
			});
		});

		function _run(params) {
			params = params || {};
			return sut.map(params.sourceKey || "", params.destinationKey || "", params.source);
		}
	});

	describe("mapAll", function() {
		it("should call 'map' for every object given", function() {
			var sourceKey = "the source key";
			var destinationKey = "the destination key";
			var first = { name: "the first" };
			var second = { name: "the second" };

			var map = sinon.stub(sut, "map").resolves();
			return sut.mapAll(sourceKey, destinationKey, [first, second]).then(function() {
				assert(map.calledWith(sourceKey, destinationKey, first));
				assert(map.calledWith(sourceKey, destinationKey, second));
			}).finally(function() {
				map.restore();
			});
		});
	});

	describe("init", function() {
		var _define;

		beforeEach(function() {
			_define = sinon.stub(sut, "define").resolves();
		});

		it("should not fail", function() {
			var failed = true;
			return sut.init().then(function() {
				failed = false;
			}).finally(function() {
				assert(!failed);
			});
		});

		afterEach(function() {
			_define.restore();

			var path = process.cwd() + "/data/mapping/definitions";
			return fs.readdirAsync(path).then(function(files) {
				return Promise.map(files, function(file) {
					require.cache[path + "/" + file] = null;
				});
			});
		});
	});
});