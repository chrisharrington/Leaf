require("../mapper").define("user", "user-view-model", {
	"id": "_id",
	name: "name",
	emailAddress: "emailAddress",
	emailNotificationForIssueAssigned: "emailNotificationForIssueAssigned",
	emailNotificationForIssueUpdated: "emailNotificationForIssueUpdated",
	emailNotificationForIssueDeleted: "emailNotificationForIssueDeleted",
	emailNotificationForNewCommentForAssignedIssue: "emailNotificationForNewCommentForAssignedIssue"
});

require("../mapper").define("user-view-model", "user", {
	"_id": "id",
	name: "name",
	emailAddress: "emailAddress"
});