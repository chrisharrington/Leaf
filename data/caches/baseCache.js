var Promise = require("bluebird");

module.exports = {
	init: function() {
		return this.promise = this.repository.get(null, { sort: this.sort });
	},

	all: function() {
		return this.promise;
	},

	dict: function(key) {
		return this.promise.then(function(items) {
			return items.toUniqueDictionary(key);
		});
	},

	details: function(id) {
		return this.promise.then(function(items) {
			var found;
			items.forEach(function(item) {
				if (item.id == id)
					found = item;
			});
			return found;
		});
	},

	invalidate: function() {
		return this.init();
	}
};