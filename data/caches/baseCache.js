var _cache = {};

exports.get = function(key) {
	return _cache[key];
};

exports.set = function(key, value) {
	_cache[key] = value;
};