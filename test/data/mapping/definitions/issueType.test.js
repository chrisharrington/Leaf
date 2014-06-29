var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("issue type mapping", function() {
	describe("issue type --> issue-type-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/issueType");
		});

		it("should define issue-type/issue-type-view-model map", function () {
			assert(_define.calledWith("issue-type", "issue-type-view-model", {
				"id": "id",
				name: "name"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/issueType.js"] = null;
		});
	});
});
