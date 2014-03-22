// Taken with gusto from http://howtonode.org/prototypical-inheritance.

Object.spawn = function (parent, props) {
	var defs = {}, key;
	for (key in props) {
		//if (props.hasOwnProperty(key)) {
			defs[key] = {value: props[key], enumerable: true};
		//}
	}
	var blah = Object.create(parent, defs);
	return Object.create(parent, defs);
};