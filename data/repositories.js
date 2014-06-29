var Promise = require("bluebird");

var directory = "./repositories/";
module.exports = {
	Project: require(directory + "projectRepository"),
	User: require(directory + "userRepository"),
	Milestone: require(directory + "milestoneRepository"),
	Priority: require(directory + "priorityRepository"),
	Status: require(directory + "statusRepository"),
	IssueType: require(directory + "issueTypeRepository"),
	Permission: require(directory + "permissionRepository"),
	UserPermission: require(directory + "userPermissionRepository"),
	Comment: require(directory + "commentRepository"),
	Issue: require(directory + "issueRepository"),
	IssueFile: require(directory + "issueFileRepository"),
    Notification: require(directory + "notificationRepository"),
	Sequence: require(directory + "sequenceRepository")
};