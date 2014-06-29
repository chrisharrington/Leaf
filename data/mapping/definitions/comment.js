var moment = require("moment");
var config = require("../../../config");

require("../mapper").define("comment", "issue-history-view-model", {
	id: "id",
	date: function(x) { return moment(x.date).format("YYYY-MM-DDTHH:mm:ssZ"); },
	text: "text",
	user: function(x) { return x.user.name; },
	userId: function(x) { return x.user.id; },
	issueId: function(x) { return x.issue.id; }
});

require("../mapper").define("issue-history-view-model", "comment", {
	date: function(x) { return moment(x.date, config("dateTimeFormat")); },
	text: "text"
});