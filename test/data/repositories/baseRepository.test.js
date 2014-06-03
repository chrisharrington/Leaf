var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var sut = require("../../../data/repositories/baseRepository");

describe("baseRepository", function() {
	describe("remove", function() {
		it("should set found model's isDeleted property to true", function() {
			var model = { isDeleted: false, saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.remove("the id").then(function() {
				assert(model.isDeleted);
			})
		});

		it("should call save on retrieved model", function() {
			var model = { saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.remove("the id").then(function() {
				assert(model.saveAsync.calledOnce);
			});
		});

		it("should find details using given id", function() {
			var id = "the id";
			var model = { saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.remove(id).then(function() {
				assert(details.calledWith(id));
			});
		});

		afterEach(function() {
			sut.details.restore();
		});
	});

	describe("restore", function() {
		it("should set found model's isDeleted property to false", function() {
			var model = { isDeleted: false, saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.restore("the id").then(function() {
				assert(!model.isDeleted);
			})
		});

		it("should call save on retrieved model", function() {
			var model = { saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.restore("the id").then(function() {
				assert(model.saveAsync.calledOnce);
			});
		});

		it("should find details using given id", function() {
			var id = "the id";
			var model = { saveAsync: sinon.stub() };
			var details = sinon.stub(sut, "details").resolves(model);
			return sut.restore(id).then(function() {
				assert(details.calledWith(id));
			});
		});

		afterEach(function() {
			sut.details.restore();
		});
	});

	describe("details", function() {
		it("should call 'one' method with given id", function() {
			var id = "the id";
			var one = sinon.stub(sut, "one").resolves();
			return sut.details(id).then(function() {
				assert(one.calledWith({ _id: id }, sinon.match.any));
			});
		});

		it("should call 'one' method with given populate", function() {
			var populate = "the populate";
			var one = sinon.stub(sut, "one").resolves();
			return sut.details(null, populate).then(function() {
				assert(one.calledWith(sinon.match.any, populate));
			});
		});

		afterEach(function() {
			sut.one.restore();
		});
	});

	describe("update", function() {
		it("should call 'saveAsync' of promisified model", function() {
			var model = { saveAsync: sinon.stub().resolves() };
			return sut.update(model).then(function() {
				assert(model.saveAsync.calledOnce);
			});
		});
	});

	describe("create", function() {
		it("should call model's 'createAsync' method with given parameters", function() {
			var model = "the model";
			sut.model = { createAsync: sinon.stub().resolves() };
			return sut.create(model).then(function() {
				assert(sut.model.createAsync.calledWith(model));
			});
		});
	});

	describe("one", function() {
		it("should call find one with given conditions", function() {
			var conditions = "the conditions";
			return _run({
				conditions: conditions
			}).then(function(result) {
				assert(result.model.findOne.calledWith(conditions));
			});
		});

		it("should call populate if populate given", function() {
			var populate = "the populate";
			return _run({
				populate: populate
			}).then(function(result) {
				assert(result.query.populate.calledWith(populate));
			});
		});

		it("should reject with error", function() {
			var error = false;
			return _run({
				error: true
			}).catch(function() {
				error = true;
			}).finally(function() {
				assert(error);
			});
		});

		it("should resolve with data", function() {
			var data = "the data";
			return _run({
				result: data
			}).then(function(result) {
				assert.equal(result.data, data);
			});
		});

		it("should resolve with null when no data returned", function() {
			return _run().then(function(result) {
				assert.equal(result.data, null);
			});
		});

		function _run(params) {
			params = params || {};
			var query = {};
			query.populate = sinon.stub().returns(query);
			query.exec = function(callback) {
				if (params.error)
					callback(params.error);
				else if (params.result || (!params.error && !params.result))
					callback(null, params.result);
			};
			sut.model = { findOne: params.findOne || sinon.stub().returns(query) };

			return sut.one(params.conditions, params.populate).then(function(data) {
				return { data: data, query: query, model: sut.model };
			});
		}
	});

	describe("get", function() {
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
				assert(e == "Error: oh noes!");
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
			var sort = "the new sort";
			return _run({
				sort: sort
			}).then(function(result) {
				assert(result.query.sort.calledWith(sort));
			});
		});

		it("should not apply sort with no sort", function() {
			return _run({
			}).then(function(result) {
				assert(result.query.sort.notCalled);
			});
		});

		it("should apply limit if given", function() {
			var limit = "the new limit";
			return _run({
				limit: limit
			}).then(function(result) {
				assert(result.query.limit.calledWith(limit));
			});
		});

		it("should not apply limit with no limit", function() {
			return _run({
			}).then(function(result) {
				assert(result.query.limit.notCalled);
			});
		});

		it("should apply skip if given", function() {
			var skip = "the new skip";
			return _run({
				skip: skip
			}).then(function(result) {
				assert(result.query.skip.calledWith(skip));
			});
		});

		it("should not apply skip with no skip", function() {
			return _run({
			}).then(function(result) {
				assert(result.query.skip.notCalled);
			});
		});

		it("should apply populate if given", function() {
			var populate = "the new populate";
			return _run({
				populate: populate
			}).then(function(result) {
				assert(result.query.populate.calledWith(populate));
			});
		});

		it("should not apply populate with no populate", function() {
			return _run({
			}).then(function(result) {
				assert(result.query.populate.notCalled);
			});
		});

		it("should call find with given conditions", function() {
			var conditions = "the conditions";
			return _run({
				conditions: conditions
			}).then(function(result) {
				assert(result.model.find.calledWith(conditions));
			});
		});

		it("should build empty options object when no options specified", function() {
			return _run({
				options: false
			}).then(function(result) {
				assert(result.data == "the result");
			});
		});

		it("should treat options as populate when options is string", function() {
			var populate = "sneaky populate";
			return _run({
				options: populate
			}).then(function(result) {
				assert(result.query.populate.calledWith(populate));
			});
		});

		function _run(params) {
			params = params || {};
			var query = {};
			query.sort = sinon.stub().returns(query);
			query.limit = sinon.stub().returns(query);
			query.skip = sinon.stub().returns(query);
			query.populate = sinon.stub().returns(query);
			query.exec = function(callback) {
				if (params.error)
					callback(params.error);
				else if (params.result || (!params.error && !params.result))
					callback(null, params.result || "the result");
			};
			var options = {
				sort: params.sort,
				limit: params.limit,
				skip: params.skip,
				populate: params.populate
			};
			sut.model = { find: params.find || sinon.stub() };
			sut.model.find.returns(query);

			return sut.get(params.conditions, params.options == false ? undefined : params.options || options).then(function(data) {
				return { data: data, query: query, model: sut.model };
			});
		}
	});

	describe("save", function() {
		it("should filter update by object's id when no query is given", function() {
			sut.model = { updateAsync: sinon.stub().resolves() };

			var object = { _id: "the id", name: "the name" };
			return sut.save(object, undefined).then(function() {
				assert(sut.model.updateAsync.calledWith({ _id: "the id" }, sinon.match.any));
			});
		});

		it("should call update without object's id", function() {
			sut.model = { updateAsync: sinon.stub().resolves() };

			var object = { _id: "the id", name: "the name" };
			return sut.save(object).then(function() {
				assert(sut.model.updateAsync.calledWith(sinon.match.any, { name: "the name" }));
			});
		});

		it("should update with query when query is given", function() {
			sut.model = { updateAsync: sinon.stub().resolves() };

			var object = { _id: "the id", name: "the name" }, query = "the query";
			return sut.save(object, query).then(function() {
				assert(sut.model.updateAsync.calledWith(query, sinon.match.any));
			});
		});

		it("should set update's multi option to true when query is given", function() {
			sut.model = { updateAsync: sinon.stub().resolves() };

			var object = { _id: "the id", name: "the name" }, query = "the query";
			return sut.save(object, query).then(function() {
				assert(sut.model.updateAsync.calledWith(query, sinon.match.any, { multi: true }));
			});
		});

		it("should not set update's multi option when no query is given", function() {
			sut.model = { updateAsync: sinon.stub().resolves() };

			var object = { _id: "the id", name: "the name" };
			return sut.save(object, undefined).then(function() {
				assert(sut.model.updateAsync.calledWith(sinon.match.any, sinon.match.any, undefined));
			});
		});
	});

	describe("count", function() {
		it("should call countAsync with given conditions", function() {
			sut.model = { countAsync: sinon.stub().resolves() };

			var conditions = { project: "the project id" };
			return sut.count(conditions).then(function() {
				assert(sut.model.countAsync.calledWith(conditions));
			});
		});
	});
});