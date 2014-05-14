var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("priority mapping", function() {
	describe("priority --> priority-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/priority");
		});

		it("should define priority/priority-view-model map", function () {
			assert(_define.calledWith("priority", "priority-view-model", {
				"id": "_id",
				name: "name",
				order: "order",
				colour: "colour"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/priority.js"] = null;
		});
	});

	describe("priority-view-model --> priority", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/priority");
		});

		it("should define priority-view-model/priority map", function () {
			assert(_define.calledWith("priority-view-model", "priority", {
				"_id": "id",
				name: "name",
				order: "order",
				colour: "colour"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/priority.js"] = null;
		});
	});
});
