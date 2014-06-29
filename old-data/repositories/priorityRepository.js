var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Priority
});

repository.updateIssues = function(priority) {
	return require("../models").Issue.updateAsync({ priorityId: priority._id }, { $set: { priority: priority.name, priorityOrder: priority.order } }, { multi: true });
};

module.exports = repository;