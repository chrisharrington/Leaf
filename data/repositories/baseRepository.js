var Promise = require("bluebird");
var elasticsearch = require("elasticsearch");
var config = require("../../config");
var uuid = require("node-uuid");

module.exports = {
	client: new elasticsearch.Client({
		host: config.call(this, "databaseLocation")
	}),

	query: function(body, index) {
		index = index || this.index;
		return client.search({
			index: index,
			body: body
		});
	},

	get: function(conditions, options) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var matches = [];
		for (var name in conditions) {
			var match = {};
			match[name] = conditions[name];
			matches.push({ match: match });
		}

		var params = { index: this.index, q: "" };
		if (options.sort)
			params.sort = _buildSort(options.sort);
		if (options.skip)
			params.from = options.skip;
		if (options.limit)
			params.size = options.limit;

		function _buildSort(sort) {
			var sorts = [];
			for (var name in sort)
				sorts.push(name + ":" + sort[name] == 1 ? "ascending" : "descending");
			return sorts;
		}
	},

	one: function(conditions) {
		return this.connection().where(conditions).limit(1).then(function(result) {
			return result[0];
		});
	},

	update: function(model) {
		return this.connection().where({ id: model.id }).update(model);
	},

	create: function(project, object) {
		return this.client.create({
			index: project.formattedName,
			type: this.type,
			body: object
		}).then(function() {
			return object;
		})
	},

	details: function(id, populate) {
		return this.one({ id: id }, populate);
	},

	remove: function(id) {
		var that = this;
		return this.details(id).then(function(model) {
			model.isDeleted = true;
			return that.update(model);
		});
	},

	removeAll: function(project) {
		return this.client.deleteByQuery({
			index: project.formattedName,
			type: this.type,
			q: "*"
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