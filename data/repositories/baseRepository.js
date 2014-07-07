var Promise = require("bluebird");
var elasticsearch = require("elasticsearch");
var config = require("../../config");
var uuid = require("node-uuid");

module.exports = {
	getIndex: function(project) {
		return this.index || project.id;
	},

	client: new elasticsearch.Client({
		host: config.call(this, "databaseLocation")
	}),

	get: function(conditions, options, project) {
		options = options || {};
		if (typeof(options) === "string")
			options = { populate: options };

		var matches = [];
		for (var name in conditions) {
			var match = {};
			match[this.type + "." + name] = conditions[name];
			matches.push({ match: match });
		}

		var params = { index: this.getIndex(project), type: this.type, body: _buildQueryFrom(conditions) };
		if (options.sort)
			params.body.sort = _buildSort(options.sort);
		if (options.skip)
			params.body.from = options.skip;
		if (options.limit)
			params.body.size = options.limit;

		return this.client.search(params).then(function(result) {
			return result.hits.hits.map(function(current) {
				return current._source;
			});
		});

		function _buildSort(sort) {
			var sorts = [];
			for (var name in sort) {
				var result = {};
				result[name] = sort[name] == 1 ? "asc" : "desc";
				sorts.push(result);
			}
			return sorts;
		}
	},

	one: function(conditions, project) {
		return this.get(conditions, { size: 1 }, project).then(function(result) {
			return result[0];
		});
	},

	all: function(project) {
		return this.get(null, null, project);
	},

	update: function(object, project) {
		return this.client.update({
			index: this.getIndex(project),
			type: this.type,
			id: object.id,
			body: {
				doc: object
			}
		});
	},

	create: function(object, project) {
		return this.client.create({
			index: this.getIndex(project),
			type: this.type,
			body: object
		}).then(function() {
			return object;
		})
	},

	details: function(id, project) {
		return this.client.get({
			index: this.getIndex(project),
			type: this.type,
			id: id
		});
	},

	remove: function(id, project) {
		var that = this;
		return this.details(id, project).then(function(model) {
			model.isDeleted = true;
			return that.update(model);
		});
	},

	removeAll: function(project) {
		var index = this.getIndex(project);
		return this.client.deleteByQuery({
			index: index,
			type: this.type,
			q: "*"
		});
	},

	restore: function(id, project) {
		var that = this;
		return this.details(id, project).then(function(model) {
			model.isDeleted = false;
			return that.update(model);
		});
	},

	count: function(conditions, project) {
		return this.count({
			index: this.getIndex(project),
			type: this.type,
			body: _buildQueryFrom(conditions)
		});
	}
};

function _buildQueryFrom(conditions) {
	var musts = [];
	for (var name in conditions) {
		var must = {}, current = conditions[name];
		if (current == true)
			current = 1;
		else if (current == false)
			current = 0;
		must[name] = current;
		musts.push({ term: must });
	}

	return {
		query: {
			bool: {
				must: musts
			}
		}
	};
}