var model = require("../models").IssueType;
var base = require("./baseRepository");

exports.all = function() {
	return base.all(model, {
		sort: { name: 1 }
	});
};
