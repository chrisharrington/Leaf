var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var moment = require("moment");
var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("comment mapping", function() {
	describe("comment --> issue-history-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/comment");
		});

		it("should define comment/issue-history-view-model map", function () {
			require("../../../../data/mapping/definitions/comment");
			assert(_define.calledWith("comment", "issue-history-view-model", {
				date: sinon.match.func,
				text: "text",
				user: sinon.match.func,
				userId: sinon.match.func,
				issueId: sinon.match.func
			}));
		});

		it("should map date using dateFormat from config", function() {
			var func = _define.firstCall.args[2].date, date = Date.now();
			assert(func({ date: date }) == moment(date).format(config("dateTimeFormat")));
		});

		it("should map user using user's name", function() {
			var func = _define.firstCall.args[2].user, name = "the name";
			assert(func({ user: { name: name }}) == name);
		});

		it("should map user using user's id", function() {
			var func = _define.firstCall.args[2].userId, id = "the id";
			assert(func({ user: { _id: id }}) == id);
		});

		it("should map issueId to issue._id", function() {
			var func = _define.firstCall.args[2].issueId, id = "the id";
			assert(func({ issue: { _id: id }}) == id);
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/comment.js"] = null;
		});
	});

	describe("issue-history-view-model --> comment", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/comment");
		});

		it("should define issue-history-view-model/comment map", function () {
			assert(_define.calledWith("issue-history-view-model", "comment", {
				date: sinon.match.func,
				text: "text"
			}));
		});

		it("should map date using dateFormat from config", function() {
			var func = _define.secondCall.args[2].date, date = Date.now();
			assert(func({ date: date }).toDate().getTime() == moment(date, config("dateTimeFormat")).toDate().getTime());
		});

		afterEach(function () {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/comment.js"] = null;
		});
	});
});