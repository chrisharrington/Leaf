var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("permission mapping", function() {
	describe("permission --> permission-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/permission");
		});

		it("should define permission/permission-view-model map", function () {
			assert(_define.calledWith("permission", "permission-view-model", {
				"id": "id",
				name: "name",
				tag: "tag"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/permission.js"] = null;
		});
	});
});
