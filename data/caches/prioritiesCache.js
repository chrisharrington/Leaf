var _cache = require("./baseCache");

exports.get = function(key) {
	return _cache.get("priorities|" + key);
}

exports.set = function(key, value) {
	_cache.set("priorities|" + key, value);
}