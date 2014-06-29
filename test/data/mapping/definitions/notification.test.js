var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("notification mapping", function() {
	describe("notification --> notification-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/notification");
		});

		it("should define notification/notification-view-model map", function () {
			assert(_define.calledWith("notification", "notification-view-model", {
				id: "id",
				type: "type",
				isViewed: "isViewed",
				comment: sinon.match.func,
				issue: sinon.match.func
			}));
		});

		it("should map comment to comment if it exists", function() {
			var func = _define.firstCall.args[2].comment, comment = "the comment";
			assert(func({ comment: comment }) == comment);
		});

		it("should map comment to null if it doesn't exist", function() {
			var func = _define.firstCall.args[2].comment;
			assert(func({ comment: undefined }) == null);
		});

		it("should map issue to subclassed issue if it exists", function() {
			var func = _define.firstCall.args[2].issue, name = "the name", number = 123, priority = "the priority";
			var result = func({ issue: { name: name, number: number, priority: priority }});
			assert(result.name == name);
			assert(result.number == number);
			assert(result.priority == priority);
		});

		it("should map issue to null if it doesn't exist", function() {
			var func = _define.firstCall.args[2].issue;
			assert(func({ issue: undefined }) == null);
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/notification.js"] = null;
		});
	});
});
