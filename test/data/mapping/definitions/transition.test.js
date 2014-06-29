var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("transition mapping", function() {
	describe("transition --> transition-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/transition");
		});

		it("should define transition/transition-view-model map", function () {
			assert(_define.calledWith("transition", "transition-view-model", {
				"id": "id",
				name: "name"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/transition.js"] = null;
		});
	});
});
