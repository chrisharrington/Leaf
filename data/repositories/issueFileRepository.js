var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").IssueFile
});

repository.issue = function(issueId) {
	return this.model.findAsync({ issue: issueId }).catch(function(e) {
		console.log("Error during issueFileRepository.issue: " + e);
	})
};

module.exports = repository;