var Promise = require("bluebird");

var directory = "./repositories/";
module.exports = {
	Priority: require(directory + "priorityRepository"),
	Status: require(directory + "statusRepository"),
	IssueType: require(directory + "issueTypeRepository"),
	Project: require(directory + "projectRepository"),
	Milestone: require(directory + "milestoneRepository"),
	Audit: require(directory + "auditRepository"),
	Comment: require(directory + "commentRepository"),
	Issue: require(directory + "issueRepository"),
	IssueAudit: require(directory + "issueAuditRepository"),
	Transition: require(directory + "transitionRepository"),
	User: require(directory + "userRepository"),
	IssueFile: require(directory + "issueFileRepository"),
    Notification: require(directory + "notificationRepository"),
	Sequence: require(directory + "sequenceRepository")
};