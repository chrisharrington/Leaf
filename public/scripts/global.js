function scope(node) {
	return angular.element(node || document).scope();
}

Object.prototype.clone = function() {
	var result = {};
	for (var name in this)
		result[name] = this[name];
	return result;
};