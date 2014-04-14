var config = require("../../config");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

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
	var resultList = [];
	for (var i = 0; i < sourceList.length; i++)
		resultList.push(exports.map(sourceKey, destinationKey, sourceList[i]));
	return Promise.all(resultList);
};

exports.init = function(maps) {
	var path = "./definitions";
	return fs.readdirAsync(path).then(function(files) {
		files.forEach(function(file) {
			require(path + "/" + file);
		});
	});
};

function _getCombinedKey(source, destination) {
	return source + "|" + destination;
}