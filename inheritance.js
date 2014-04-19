// Taken with gusto from http://howtonode.org/prototypical-inheritance.

Object.spawn = function (parent, props) {
	var defs = {}, key;
	for (key in props)
		defs[key] = {value: props[key], enumerable: true};
	return Object.create(parent, defs);
};