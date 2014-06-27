module.exports = function(connection) {
	var repository = Object.spawn(require("./baseRepository"), {
		table: "statuses",
		connection: connection
	});

	repository.updateIssues = function(status) {
		return require("../models").Issue.updateAsync({ statusId: status._id }, { $set: { status: status.name, statusOrder: status.order } }, { multi: true });
	};

	return module.exports = repository;
};