var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var moment = require("moment");
var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("issue mapping", function() {
	describe("issue --> issue-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/issue");
		});

		it("should define issue/issue-view-model map", function () {
			require("../../../../data/mapping/definitions/comment");
			assert(_define.calledWith("issue", "issue-view-model", {
				id: "_id",
				description: "name",
				details: "details",
				number: "number",
				milestone: "milestone",
				milestoneId: "milestoneId",
				priority: "priority",
				priorityId: "priorityId",
				status: "status",
				statusId: "statusId",
				tester: "tester",
				testerId: "testerId",
				developer: "developer",
				developerId: "developerId",
				type: "type",
				typeId: "typeId",
				priorityStyle: sinon.match.func,
				opened: sinon.match.func,
				closed: sinon.match.func,
				lastUpdated: sinon.match.func,
				updatedBy: "updatedBy"
			}));
		});

		it("should map priorityStyle to lower case priority name", function() {
			var func = _define.firstCall.args[2].priorityStyle, priority = "Critical";
			assert(func({ priority: priority }) == priority.toLowerCase());
		});

		it("should map opened using dateFormat from config", function() {
			var func = _define.firstCall.args[2].opened, date = Date.now();
			assert(func({ opened: date }) == moment(date).format(config("dateFormat")));
		});

		it("should map closed using dateFormat from config when it exists", function() {
			var func = _define.firstCall.args[2].closed, date = Date.now();
			assert(func({ closed: date }) == moment(date).format(config("dateFormat")));
		});

		it("should map closed to empty string when it doesn't exist", function() {
			var func = _define.firstCall.args[2].closed, date = Date.now();
			assert(func({ closed: null }) == "");
		});

		it("should map updated using dateFormat from config", function() {
			var func = _define.firstCall.args[2].lastUpdated, date = Date.now();
			assert(func({ updated: date }) == moment(date).format(config("dateFormat")));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/issue.js"] = null;
		});
	});

	describe("issue-view-model --> issue", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/issue");
		});

		it("should define issue/issue-view-model map", function () {
			require("../../../../data/mapping/definitions/comment");
			assert(_define.calledWith("issue-view-model", "issue", {
				"_id": "id",
				name: "description",
				details: "details",
				number: "number",
				milestone: "milestone",
				milestoneId: "milestoneId",
				priority: "priority",
				priorityId: "priorityId",
				status: "status",
				statusId: "statusId",
				tester: "tester",
				testerId: "testerId",
				developer: "developer",
				developerId: "developerId",
				type: "type",
				typeId: "typeId",
				opened: sinon.match.func,
				closed: sinon.match.func
			}));
		});

		it("should map opened using dateFormat from config", function() {
			var func = _define.secondCall.args[2].opened, date = Date.now();
			assert(func({ opened: date }).toDate().getTime() == moment(date, config("dateFormat")).toDate().getTime());
		});

		it("should map closed using dateFormat from config if it exists", function() {
			var func = _define.secondCall.args[2].closed, date = Date.now();
			assert(func({ closed: date }).toDate().getTime() == moment(date, config("dateFormat")).toDate().getTime());
		});

		it("should map empty string closed to null", function() {
			var func = _define.secondCall.args[2].closed;
			assert(func({ closed: "" }) == null);
		});

		it("should map null closed to null", function() {
			var func = _define.secondCall.args[2].closed;
			assert(func({ closed: null }) == null);
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/issue.js"] = null;
		});
	});
});