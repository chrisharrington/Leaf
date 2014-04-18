var _cache = {};

module.exports = {
	init: function() {
		return this.repository.get().then(function(models) {
			models.forEach(function(model) {
				_cache[model._id] = model;
			});
		});
	},

	all: function() {
		return new Promise(function(resolve) {
			var list = [];
			for (var name in _cache)
				list.push(_cache[name]);
			resolve(list);
		});
	},

	details: function(id) {
		return new Promise(function(resolve, reject) {
			if (_cache[id]) resolve(_cache[id]);
			else reject("No such entry for id \"" + id + "\".");
		});
	}
};