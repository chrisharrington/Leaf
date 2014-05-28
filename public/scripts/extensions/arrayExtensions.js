Array.prototype.exists = function(func) {
	for (var i = 0; i < this.length; i++)
		if (func(this[i]))
			return true;
	return false;
};

Array.prototype.where = function(func) {
	var result = [];
	for (var i = 0; i < this.length; i++)
		if (func(this[i]))
			result.push(this[i]);
	return result;
};