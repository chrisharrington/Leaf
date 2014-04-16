var moment = require("moment");
var config = require("../../../config");

require("../mapper").define("comment", "issue-history-view-model", {
	date: function(x) { return moment(x.date).format(config("dateTimeFormat")); },
	text: "text",
	user: function(x) { return x.user.name; },
	issueId: function(x) { return x.issue._id; }
});

require("../mapper").define("issue-history-view-model", "comment", {
	date: function(x) { return moment(x.date, config("dateTimeFormat")); },
	text: "text"
});