var Promise = require("bluebird");

var directory = "./repositories/";
module.exports = function(knex) {
	return module.exports = {
		Project: require(directory + "projectRepository")(knex),
		User: require(directory + "userRepository")(knex),
		Milestone: require(directory + "milestoneRepository")(knex),
		Priority: require(directory + "priorityRepository")(knex),
		Status: require(directory + "statusRepository")(knex),
		IssueType: require(directory + "issueTypeRepository")(knex),
		Permission: require(directory + "permissionRepository")(knex),
		UserPermission: require(directory + "userPermissionRepository")(knex)
//
//	Comment: require(directory + "commentRepository"),
//	Issue: require(directory + "issueRepository"),
//	IssueAudit: require(directory + "issueAuditRepository"),
//	Transition: require(directory + "transitionRepository"),
//	IssueFile: require(directory + "issueFileRepository"),
//    Notification: require(directory + "notificationRepository"),
//	Sequence: require(directory + "sequenceRepository"),

//
	};
};