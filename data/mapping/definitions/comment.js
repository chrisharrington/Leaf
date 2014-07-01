var moment = require("moment");
var config = require("../../../config");

require("../mapper").define("comment", "issue-history-view-model", {
	id: "id",
	date: function(x) { return moment(x.created_at).format("YYYY-MM-DDTHH:mm:ssZ"); },
	text: "text",
	user: function(x) { return x.user; },
	userId: "userId",
	issueId: "issueId"
});

require("../mapper").define("issue-history-view-model", "comment", {
	"created_at": function(x) { return moment(x.date, config("dateTimeFormat")); },
	text: "text"
});