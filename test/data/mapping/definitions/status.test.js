var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("status mapping", function() {
	describe("status --> status-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/status");
		});

		it("should define status/status-view-model map", function () {
			assert(_define.calledWith("status", "status-view-model", {
				"id": "_id",
				name: "name",
				order: "order"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/status.js"] = null;
		});
	});
});
