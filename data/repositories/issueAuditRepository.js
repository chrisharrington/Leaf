var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").IssueAudit
});

repository.issue = function(issueId) {
	return this.model.find({ "issue._id": issueId }).catch(function(e) {
		console.log("Error during issueAuditRepository.issue: " + e);
	})
};

module.exports = repository;