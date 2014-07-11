Array.prototype.toDictionary = function(key) {
	if (!key)
		key = function(x) { return x.id; };

	var dictionary = {};
	this.forEach(function(item) {
		var currentKey = key(item);
		if (!currentKey)
			return true;
		if (!dictionary[currentKey])
			dictionary[currentKey] = [];
		dictionary[currentKey].push(item);
	});
	return dictionary;
};

Array.prototype.toUniqueDictionary = function(key) {
	if (!key)
		key = function(x) { return x.id; };

	var dictionary = {};
	this.forEach(function(item) {
		var currentKey = key(item);
		if (!currentKey)
			return true;
		dictionary[currentKey] = item;
	});
	return dictionary;
};