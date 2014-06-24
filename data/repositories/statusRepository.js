var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Status
});

repository.updateIssues = function(status) {
	return require("../models").Issue.updateAsync({ statusId: status._id }, { $set: { status: status.name, statusOrder: status.order } }, { multi: true });
};

module.exports = repository;