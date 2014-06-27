module.exports = function(connection) {
	var repository = Object.spawn(require("./baseRepository"), {
		table: "priorities",
		connection: connection
	});

	repository.updateIssues = function(priority) {
		return require("../models").Issue.updateAsync({ priorityId: priority._id }, { $set: { priority: priority.name, priorityOrder: priority.order } }, { multi: true });
	};

	return module.exports = repository;
};