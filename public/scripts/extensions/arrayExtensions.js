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

Array.prototype.first = function(func) {
	return this.where(func)[0];
};

Array.prototype.dict = function(key) {
	var result = {};
	for (var i = 0; i < this.length; i++)
		result[this[i][key]] = this[i];
	return result;
}