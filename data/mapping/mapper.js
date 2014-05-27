var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

exports.maps = {};

exports.define = function(sourceKey, destinationKey, definition) {
	exports.maps[_getCombinedKey(sourceKey, destinationKey)] = definition;
};

exports.map = function(sourceKey, destinationKey, source) {
	return new Promise(function(resolve, reject) {
		_map(sourceKey, destinationKey, source, resolve, reject);
	});
};

exports.mapAll = function(sourceKey, destinationKey, sourceList) {
	return Promise.map(sourceList, function(source) {
		return exports.map(sourceKey, destinationKey, source);
	});
};

exports.mapSynchronous = function(sourceKey, destinationKey, source) {
	return _map(sourceKey, destinationKey, source);
};

exports.mapAllSynchronous = function(sourceKey, destinationKey, sourceList) {
	return sourceList.map(function(source) {
		return exports.mapSynchronous(sourceKey, destinationKey, source);
	});
};

exports.init = function() {
	var path = process.cwd() + "/data/mapping/definitions";
	return fs.readdirAsync(path).then(function(files) {
		return Promise.map(files, function(file) {
			require(path + "/" + file);
		});
	});
};

function _getCombinedKey(source, destination) {
	return source + "|" + destination;
}

function _map(sourceKey, destinationKey, source, resolve, reject) {
	if (source == null) {
		var error = new Error("Missing source while mapping.");
		if (reject)
			reject(error);
		else
			throw error;
	} else {
		var key = _getCombinedKey(sourceKey, destinationKey);
		if (!exports.maps[key])
			reject(new Error("No such mapping definition for \"" + key + "\""));
		else {
			var definition = exports.maps[key];
			var result = {};
			for (var name in definition) {
				var prop = definition[name];
				result[name] = typeof(prop) == "function" ? prop(source) : source[prop];
			}
			if (resolve)
				resolve(result);
			else
				return result;
		}
	}
}