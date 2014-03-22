var _maps = {};

exports.define = function(sourceKey, destinationKey, definition) {
	_maps[_getCombinedKey(sourceKey, destinationKey)] = definition;
};

exports.map = function(sourceKey, destinationKey, source) {
	try {
		if (source == null)
			return null;

		var key = _getCombinedKey(sourceKey, destinationKey);
		if (!_maps || !_maps[key])
			return source;

		var definition = _maps[key];
		var result = {};
		for (var name in definition) {
			var prop = definition[name];
			var type = typeof(prop);
			if (type == "function")
				prop = prop(source);
			else
				prop = source[prop];
			result[name] = prop;
		}
		return result;
	} catch (error) {
		console.log("Error during mapping: " + error);
		return source;
	}
};

exports.mapAll = function(sourceKey, destinationKey, sourceList) {
	var resultList = [];
	for (var i = 0; i < sourceList.length; i++)
		resultList.push(exports.map(sourceKey, destinationKey, sourceList[i]));
	return resultList;
};

function _getCombinedKey(source, destination) {
	return source + "|" + destination;
}