var Promise = require("bluebird");

var directory = "./caches/";
module.exports = {
	init: function() {
		var alls = [];
		for (var name in module.exports)
			if (name != "init")
				alls.push(module.exports[name].init());
		return Promise.all(alls);
	},

	Priority: require(directory + "priorityCache"),
	Status: require(directory + "statusCache"),
	Transition: require(directory + "transitionCache"),
	IssueType: require(directory + "issueTypeCache")
};