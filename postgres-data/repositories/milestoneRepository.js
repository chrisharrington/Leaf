module.exports = function(connection) {
	var repository = Object.spawn(require("./baseRepository"), {
		table: "milestones",
		connection: connection
	});

	repository.updateIssues = function(milestone) {
		return require("../models").Issue.updateAsync({ milestoneId: milestone._id }, { $set: { milestone: milestone.name, milestoneOrder: milestone.order } }, { multi: true });
	};

	return module.exports = repository;
};