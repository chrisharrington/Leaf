var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/repositories/baseIssueRepository");

describe("commentRepository", function() {
	describe("issue", function() {
		it("should call 'get' with issue id condition", function() {
			var id = "the id";
			var get = sinon.stub(sut, "get").resolves();
			return sut.issue(id).then(function() {
				assert(get.calledWith({ "issue": id, isDeleted: sinon.match.any }));
			});
		});

		it("should call 'get' with isDeleted false condition", function() {
			var get = sinon.stub(sut, "get").resolves();
			return sut.issue("the id").then(function() {
				assert(get.calledWith({ "issue": sinon.match.any, isDeleted: false }));
			});
		});

		it("should call 'get' with given populate", function() {
			var populate = "the populate";
			var get = sinon.stub(sut, "get").resolves();
			return sut.issue("the id", populate).then(function() {
				assert(get.calledWith(sinon.match.any, populate));
			});
		});

		it("should call 'get' with populate set on model", function() {
			var populate = "the populate";
			var get = sinon.stub(sut, "get").resolves();
			sut.populate = populate;
			return sut.issue("the id").then(function() {
				assert(get.calledWith(sinon.match.any, populate));
			});
		});

		afterEach(function() {
			sut.get.restore();
		});
	});
});