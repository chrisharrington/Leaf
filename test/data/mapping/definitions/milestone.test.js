var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("milestone mapping", function() {
	describe("milestone --> milestone-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/milestone");
		});

		it("should define milestone/milestone-view-model map", function () {
			assert(_define.calledWith("milestone", "milestone-view-model", {
				"id": "id",
				name: "name",
				order: "order"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/milestone.js"] = null;
		});
	});

	describe("milestone-view-model --> milestone", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/milestone");
		});

		it("should define milestone/milestone-view-model map", function () {
			assert(_define.calledWith("milestone-view-model", "milestone", {
				"id": "id",
				name: "name",
				order: "order"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/milestone.js"] = null;
		});
	});
});
