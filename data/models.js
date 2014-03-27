var Promise = require("bluebird");

var directory = "./models/";
module.exports = {
	Project: require(directory + "project"),
	Milestone: require(directory + "milestone"),
	Priority: require(directory + "priority"),
	Status: require(directory + "status"),
	IssueType: require(directory + "issueType"),
	Audit: require(directory + "audit"),
	Comment: require(directory + "comment"),
	Issue: require(directory + "issue"),
	IssueAudit: require(directory + "issueAudit"),
	Transition: require(directory + "transition"),
	User: require(directory + "user"),
	IssueFile: require(directory + "issueFile")
};

