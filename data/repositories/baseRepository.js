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
				if (err) reject(err);
				else resolve(data);
			});
		});
	},

	one: function(conditions, populate) {
		return this.get(conditions, populate).then(function(data) {
			return data.length == 0 ? null : data[0];
		});
	},

	create: function(model) {
		return this.model.createAsync(model);
	},

	details: function(id, populate) {
		var model = this.model;
		return new Promise(function(resolve, reject) {
			var query = model.findOne({ "_id": id });
			if (populate && populate != "")
				query = query.populate(populate);
			query.exec(function(err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	},

	remove: function(id) {
		return this.model.findOneAsync({ "_id": id }).then(function (model) {
			model.isDeleted = true;
			return Promise.promisifyAll(model).saveAsync();
		});
	}
};