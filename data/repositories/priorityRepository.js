var model = require("../models").Priority;
var base = require("./baseRepository");

exports.all = function() {
	return base.all(model, {
		sort: { order: 1 }
	});
};
