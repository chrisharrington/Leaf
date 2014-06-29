var Promise = require("bluebird");
var mongoose = require("mongoose");

module.exports = {
	connection: function(table) {
		return require("../../data/connection").connection(table || this.table);
	},

	get: function(conditions, options) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var query = this.connection();
		if (conditions)
			query = query.where(conditions);
		if (options.sort) {
			var sort = _buildOrderByFromSort(options.sort);
			query = query.orderBy(sort.column, sort.direction);
		}
		if (options.limit)
			query = query.limit(options.limit);
		if (options.skip)
			query = query.offset(options.skip);
		return query;
	},

	one: function(conditions, populate) {
		return this.get(conditions, { limit: 1 }).then(function(result) {
			return result[0];
		});
	},

	update: function(model) {
		return this.connection().where({ id: model.id }).update(model);
	},

	create: function(object) {
		if (!object["created_at"])
			object["created_at"] = new Date();
		if (!object["updated_at"])
			object["updated_at"] = new Date();
		return this.connection(this.table).returning("id").insert(object);
	},

	details: function(id, populate) {
		return this.one({ _id: id }, populate);
	},

	remove: function(id) {
		var that = this;
		return this.details(id).then(function(model) {
			model.isDeleted = true;
			return that.update(model);
		});
	},

	restore: function(id) {
		var that = this;
		return this.details(id).then(function(model) {
			model.isDeleted = false;
			return that.update(model);
		});
	},

	count: function(conditions) {
		return this.connection().where(conditions).count("*");
	}
};

function _buildOrderByFromSort(sort) {
	var column, direction;
	for (var name in sort) {
		column = name;
		direction = sort[name] == -1 ? "desc" : "asc";
	}
	return { column: column, direction: direction };
}