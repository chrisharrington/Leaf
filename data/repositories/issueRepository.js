var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue,
	sort: { priority: -1, opened: 1 }
});

repository.number = function(projectId, number) {
	var me = this;
	return me.model.findOneAsync({ project: projectId, number: number }).catch(function(e) {
		console.log("Error in issueRepository.number: " + e);
	});
};

module.exports = repository;