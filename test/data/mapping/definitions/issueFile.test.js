var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("issue file mapping", function() {
	describe("issue file --> issue-file-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/issueFile");
		});

		it("should define issue-file/issue-file-view-model map", function () {
			assert(_define.calledWith("issue-file", "issue-file-view-model", {
				"id": "id",
				name: "name",
				size: sinon.match.func
			}));
		});

		it("should map size to a stringified size", function() {
			var func = _define.firstCall.args[2].size, size = 12345;
			assert(func({ size: size }) == size.toSizeString());
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/issueFile.js"] = null;
		});
	});
});
