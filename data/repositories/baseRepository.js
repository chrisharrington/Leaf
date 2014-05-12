var Promise = require("bluebird");

module.exports = {
	get: function(conditions, options) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var model = this.model;
		return new Promise(function(resolve, reject) {
			var query = model.find(conditions);
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
		return this.get(conditions, { populate: populate, limit: 1 }).then(function(data) {
			return data.length == 0 ? null : data[0];
		});
	},

	update: function(model) {
		return Promise.promisifyAll(model).saveAsync();
	},

	save: function(obj) {
		var id = obj._id;
		delete obj._id;
		return Promise.promisifyAll(this.model).updateAsync({ _id: id }, obj);
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
	}
};