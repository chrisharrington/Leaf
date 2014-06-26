var directory = "./models/";

module.exports = function(s) {
	var list = [
		"project",
		"priority"
	];

	var models = {};
	list.forEach(function(file) {
		var definition = require("./models/" + file).define(s);
		models[definition.name] = definition;
	});

	list.forEach(function(file) {
		var model = require("./models/" + file);
		if (model.associate)
			model.associate(models);
	});

	return models;
};