var config = require("../../../config");
var moment = require("moment");

require("../mapper").define("issue", "issue-view-model", {
	id: "id",
	details: "description",
	description: "name",
	number: "id",
	milestone: "milestone",
	milestoneId: "milestoneId",
	priority: "priority",
	priorityId: "priorityId",
	status: "status",
	statusId: "statusId",
	tester: "tester",
	testerId: "testerId",
	developer: "developer",
	developerId: "developerId",
	type: "issueType",
	typeId: "issueTypeId",
	priorityStyle: function(x) { return x.priority.toLowerCase(); },
	opened: function(x) { return moment(x.created_at).format(config("dateFormat")); },
	closed: function(x) { return x.closed ? moment(x.closed).format(config("dateFormat")) : ""; },
	lastUpdated: function(x) { return moment(x.updated).format(config("dateFormat")); },
	updatedBy: "updatedBy",
	isDeleted: "isDeleted"
});

require("../mapper").define("issue-view-model", "issue", {
	"id": "id",
	name: "description",
	description: "details",
	milestoneId: "milestoneId",
	priorityId: "priorityId",
	statusId: "statusId",
	testerId: "testerId",
	developerId: "developerId",
	issueTypeId: "typeId",
	created_at: function(x) { return moment(x.opened, config("dateFormat")); },
	closed: function(x) { return x.closed == "" || x.closed == null ? null : moment(x.closed, config("dateFormat")); }
});

require("../mapper").define("issue", "issue-list-view-model", {
	id: "id",
	description: "name",
	details: "description",
	number: "id",
	priorityId: "priorityId",
	developer: "developer",
	developerId: "developerId",
	testerId: "testerId"
});