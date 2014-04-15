var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("project mapping", function() {
	describe("project --> project-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/project");
		});

		it("should define project/project-view-model map", function () {
			assert(_define.calledWith("project", "project-view-model", {
				"id": "_id",
				name: "name"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/project.js"] = null;
		});
	});
});
