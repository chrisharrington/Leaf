var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/repositories/baseIssueRepository");

describe("commentRepository", function() {
	describe("issue", function() {
		it("should call 'one' with issue id condition", function() {
			var id = "the id";
			var one = sinon.stub(sut, "one").resolves();
			return sut.issue(id).then(function() {
				assert(one.calledWith({ "issue": id }));
			});
		});

		it("should call 'one' with given populate", function() {
			var populate = "the populate";
			var one = sinon.stub(sut, "one").resolves();
			return sut.issue("the id", populate).then(function() {
				assert(one.calledWith(sinon.match.any, populate));
			});
		});

		it("should call 'one' with populate set on model", function() {
			var populate = "the populate";
			var one = sinon.stub(sut, "one").resolves();
			sut.populate = populate;
			return sut.issue("the id").then(function() {
				assert(one.calledWith(sinon.match.any, populate));
			});
		});

		afterEach(function() {
			sut.one.restore();
		});
	});
});