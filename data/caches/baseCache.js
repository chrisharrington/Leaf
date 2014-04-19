var Promise = require("bluebird");

module.exports = {
	cache: {},

	init: function() {
		var cache = this.cache;
		return this.repository.get(null, { sort: this.sort }).then(function(models) {
			models.forEach(function(model) {
				cache[model._id] = model;
			});
		});
	},

	all: function() {
		var cache = this.cache;
		return new Promise(function(resolve) {
			var list = [];
			for (var name in cache)
				list.push(cache[name]);
			resolve(list);
		});
	},

	details: function(id) {
		var cache = this.cache;
		return new Promise(function(resolve, reject) {
			if (cache[id]) resolve(cache[id]);
			else reject("No such entry for id \"" + id + "\".");
		});
	}
};