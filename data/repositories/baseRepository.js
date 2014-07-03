var Promise = require("bluebird");
var mongoose = require("mongoose");

module.exports = {
	get: function(conditions, options) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var model = this.model;
		return new Promise(function(resolve, reject) {
			var query = model.find(conditions, options.projection);
			if (options.sort)
				query = query.sort(options.sort);
			if (options.limit)
				query = query.limit(options.limit);
			if (options.skip)
				query = query.skip(options.skip);
			if (options.populate && options.populate != "")
				query = query.populate(options.populate);
			query.exec(function(err, data) {
				if (err) reject(new Error(err));
				else resolve(data);
			});
		});
	},

	one: function(conditions, populate) {
		var model = this.model;
		return new Promise(function(resolve, reject) {
			var query = model.findOne(conditions);
			if (populate)
				query.populate(populate);
			query.exec(function(err, data) {
				if (err) reject(err);
				else resolve(data || null);
			});
		});
	},

	update: function(model) {
		return Promise.promisifyAll(model).saveAsync();
	},

	save: function(obj, query) {
		var id = obj._id;
		delete obj._id;
		return Promise.promisifyAll(this.model).updateAsync(query || { _id: id }, obj, query ? { multi: true } : undefined);
	},

	create: function(model) {
		return this.model.createAsync(model);
	},

	details: function(id, populate) {
		return this.one({ _id: id }, populate);
	},

	remove: function(id) {
		return this.details(id).then(function(model) {
			model.isDeleted = true;
			return Promise.promisifyAll(model).saveAsync();
		});
	},

	restore: function(id) {
		return this.details(id).then(function(model) {
			model.isDeleted = false;
			return Promise.promisifyAll(model).saveAsync();
		});
	},

	count: function(conditions) {
		return this.model.countAsync(conditions);
	}
};