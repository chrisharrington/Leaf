var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/repositories/commentRepository");

describe("commentRepository", function() {
	describe("issue", function() {
		it("should call 'one' with issue id condition", function() {
			var id = "the id";
			var one = sinon.stub(sut, "one").resolves();
			return sut.issue(id).then(function() {
				assert(one.calledWith({ "issue": id }));
			});
		});

		it("should call 'one' with 'issue user' populate", function() {
			var one = sinon.stub(sut, "one").resolves();
			return sut.issue("the id").then(function() {
				assert(one.calledWith(sinon.match.any, "issue user"));
			});
		});

		afterEach(function() {
			sut.one.restore();
		});
	});
});