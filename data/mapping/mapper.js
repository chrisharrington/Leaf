var Promise = require("bluebird");
var requireDirectory = require("require-directory");

exports.maps = {};

exports.define = function(sourceKey, destinationKey, definition) {
	exports.maps[_getCombinedKey(sourceKey, destinationKey)] = definition;
};

exports.map = function(sourceKey, destinationKey, source) {
	return new Promise(function(resolve, reject) {
		if (source == null)
			reject("Missing source while mapping.");
		else {
			var key = _getCombinedKey(sourceKey, destinationKey);
			if (!exports.maps[key])
				reject("No such mapping definition for \"" + key + "\"");
			else {
				var definition = exports.maps[key];
				var result = {};
				for (var name in definition) {
					var prop = definition[name];
					result[name] = typeof(prop) == "function" ? prop(source) : source[prop];
				}
				resolve(result);
			}
		}
	});
};

exports.mapAll = function(sourceKey, destinationKey, sourceList) {
	return Promise.map(sourceList, function(source) {
		return exports.map(sourceKey, destinationKey, source);
	});
};

exports.init = function() {
	requireDirectory.call(this, "./definitions");
};

function _getCombinedKey(source, destination) {
	return source + "|" + destination;
}