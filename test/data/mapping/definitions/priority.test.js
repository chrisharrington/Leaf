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
				order: "order"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/priority.js"] = null;
		});
	});
});
