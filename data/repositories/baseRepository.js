var Promise = require("bluebird");
var elasticsearch = require("elasticsearch");
var config = require("../../config");
var uuid = require("node-uuid");

module.exports = {
	client: new elasticsearch.Client({
		host: config.call(this, "databaseLocation")
	}),

	get: function(project, conditions, options) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var matches = [];
		for (var name in conditions) {
			var match = {};
			match[name] = conditions[name];
			matches.push({ match: match });
		}

		var params = { index: project.id, type: this.type, q: _buildQueryFrom(conditions) };
		if (options.sort)
			params.sort = _buildSort(options.sort);
		if (options.skip)
			params.from = options.skip;
		if (options.limit)
			params.size = options.limit;

		return this.client.search(params);

		function _buildSort(sort) {
			var sorts = [];
			for (var name in sort)
				sorts.push(name + ":" + sort[name] == 1 ? "ascending" : "descending");
			return sorts;
		}
	},

	one: function(conditions) {
		return this.get(conditions, { size: 1 }).then(function(result) {
			return result[0];
		});
	},

	update: function(model) {
		return this.client.update({
			index: model.formattedProject,
			type: this.type,
			id: model.id,
			body: {
				doc: model
			}
		});
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

	details: function(project, id) {
		return this.client.get({
			index: project.id,
			type: this.type,
			id: id
		});
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

	count: function(project, conditions) {
		return this.count({
			index: project.id,
			type: this.type,
			q: _buildQueryFrom(conditions)
		});
	}
};

function _buildQueryFrom(conditions) {
	var query = "";
	for (var name in conditions)
		query += name + ":" + conditions[name] + " AND ";
	return query.substring(0, query.substring.length - 5);
}

function _buildOrderByFromSort(sort) {
	var column, direction;
	for (var name in sort) {
		column = name;
		direction = sort[name] == -1 ? "desc" : "asc";
	}
	return { column: column, direction: direction };
}