Array.prototype.toDictionary = function(key) {
	if (!key)
		key = function(x) { return x.id; };

	var dictionary = {};
	this.forEach(function(item) {
		if (!dictionary[key(item)])
			dictionary[key(item)] = [];
		dictionary[key(item)].push(item);
	});
	return dictionary;
};

Array.prototype.toUniqueDictionary = function(key) {
	if (!key)
		key = function(x) { return x.id; };

	var dictionary = {};
	this.forEach(function(item) {
		if (!dictionary[key(item)])
			dictionary[key(item)] = [];
		dictionary[key(item)] = item;
	});
	return dictionary;
};