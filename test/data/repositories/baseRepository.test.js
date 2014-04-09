var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/repositories/baseRepository");

describe("baseRepository", function() {
	describe("all", function() {
		it("should execute query", function() {
			var completed = false;
			return _run().then(function() {
				completed = true;
			}).finally(function() {
				assert(completed);
			});
		});

		it("should resolve with result", function() {
			return _run({
				result: "the result"
			}).then(function(result) {
				assert(result.data == "the result");
			});
		});

		it("should reject when exec results in an error", function() {
			return _run({
				error: "oh noes!"
			}).catch(function(e) {
				assert(e == "oh noes!");
			});
		});

		it("should reject when find fails", function() {
			var error = false;
			return _run({
				find: sinon.stub().throws()
			}).catch(function() {
				error = true;
			}).finally(function() {
				assert(error);
			});
		});

		it("should apply sort if sort given", function() {
			return _run({
				sort: "the sort"
			}).then(function(result) {
				assert(result.query.sort.calledWith("the sort"));
			});
		});

		it("should apply where clause if given", function() {
			return _run({
				where: "the where clause"
			}).then(function(result) {
				assert(result.query.where.calledWith("the where clause"));
			});
		});

		it("should apply multiple where clauses if given", function() {
			return _run({
				where: ["first", "second", "third"]
			}).then(function(result) {
				assert(result.query.where.calledWith("first"));
				assert(result.query.where.calledWith("second"));
				assert(result.query.where.calledWith("third"));
			});
		});

		it("should apply limit if given", function() {
			return _run({
				limit: "the limit"
			}).then(function(result) {
				assert(result.query.limit.calledWith("the limit"));
			});
		});

		it("should apply skip if given", function() {
			return _run({
				skip: "the skip"
			}).then(function(result) {
				assert(result.query.skip.calledWith("the skip"));
			});
		});

		function _run(params) {
			params = params || {};
			var query = { sort: sinon.stub(), where: sinon.stub(), limit: sinon.stub(), skip: sinon.stub(), exec: function(callback) { callback(params.error || null, params.result || {}); } };
			for (var name in query)
				if (query[name].returns)
					query[name].returns(query);
			sut.model = { find: params.find || sinon.stub() };
			sut.model.find.returns(query);
			if (params.sort)
				sut.sort = params.sort;
			if (params.where)
				sut.where = params.where;
			if (params.limit)
				sut.limit = params.limit;
			if (params.skip)
				sut.skip = params.skip;

			return sut.all().then(function(data) {
				return { data: data, query: query };
			});
		}
	});
});