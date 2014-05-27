Array.prototype.toDictionary = function(key) {
	var dictionary = {};
	this.forEach(function(item) {
		if (!dictionary[key(item)])
			dictionary[key(item)] = [];
		dictionary[key(item)].push(item);
	});
	return dictionary;
};