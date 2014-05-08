require("../mapper").define("user", "user-view-model", {
	"id": "_id",
	name: "name",
	phone: "phone",
	emailAddress: "emailAddress",
	emailNotificationForIssueAssigned: "emailNotificationForIssueAssigned",
	emailNotificationForIssueUpdated: "emailNotificationForIssueUpdated",
	emailNotificationForIssueDeleted: "emailNotificationForIssueDeleted",
	emailNotificationForNewCommentForAssignedIssue: "emailNotificationForNewCommentForAssignedIssue",
	isDeleted: "isDeleted"
});

require("../mapper").define("user-view-model", "user", {
	"_id": "id",
	name: "name",
	emailAddress: "emailAddress",
	phone: "phone",
	emailNotificationForIssueAssigned: "emailNotificationForIssueAssigned",
	emailNotificationForIssueUpdated: "emailNotificationForIssueUpdated",
	emailNotificationForIssueDeleted: "emailNotificationForIssueDeleted",
	emailNotificationForNewCommentForAssignedIssue: "emailNotificationForNewCommentForAssignedIssue"
});

require("../mapper").define("user", "user-summary-view-model", {
	"id": "_id",
	name: "name",
	emailAddress: "emailAddress",
	phone: "phone",
	isActivated: function(x) { return x.activationToken == null; },
	isDeleted: "isDeleted"
});