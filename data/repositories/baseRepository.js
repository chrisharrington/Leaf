var Promise = require("bluebird");

module.exports = {
	all: function() {
		var me = this;
		return new Promise(function(resolve, reject) {
			var query = me.model.find();
			if (me.sort)
				query = query.sort(me.sort);
			if (me.where)
				query = _applyFilter(query, me.where);
			if (me.limit)
				query = query.limit(me.limit);
			if (me.skip)
				query = query.skip(me.skip);
			query.exec(function(err, result) {
				if (err) {
					console.log("Error while retrieving all: " + err);
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},

	get: function(conditions, populate) {
		var model = this.model;
		return new Promise(function(resolve, reject) {
			var query = model.find(conditions);
			if (populate && populate != "")
				query = query.populate(populate);
			query.exec(function(err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	},

	getOne: function(conditions, populate) {
		return module.exports.get(conditions, populate).then(function(data) {
			return data[0];
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

function _applyFilter(query, wheres) {
	if (!wheres.length)
		wheres = [wheres];
	for (var i = 0; i < wheres.length; i++)
		query = query.where(wheres[i]);
	return query;
}