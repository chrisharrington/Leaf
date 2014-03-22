var model = require("../models").Status;
var base = require("./baseRepository");

exports.all = function() {
	return base.all(model, {
		sort: { order: 1 }
	});
};
