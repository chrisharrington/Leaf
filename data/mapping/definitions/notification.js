require("../mapper").define("notification", "notification-view-model", {
	id: "_id",
	type: "type",
	isViewed: "isViewed",
	comment: function(x) { return x.comment ? x.comment : null; },
	issue: function(x) {
		return x.issue == null ? null : { name: x.issue.name, number: x.issue.number, priority: x.issue.priority }		}
});