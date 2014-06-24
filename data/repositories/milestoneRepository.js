var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Milestone
});

repository.updateIssues = function(milestone) {
	return require("../models").Issue.updateAsync({ milestoneId: milestone._id }, { $set: { milestone: milestone.name } }, { multi: true });
};

module.exports = repository;