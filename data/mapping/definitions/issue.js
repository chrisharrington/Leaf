var config = require("../../../config");
var moment = require("moment");

require("../mapper").define("issue", "issue-view-model", {
	id: "_id",
	description: "name",
	details: "details",
	number: "number",
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
	type: "type",
	typeId: "typeId",
	priorityStyle: function(x) { return x.priority.toLowerCase(); },
	opened: function(x) { return moment(x.opened).format(config("dateFormat")); },
	closed: function(x) { return x.closed ? moment(x.closed).format(config("dateFormat")) : ""; },
	lastUpdated: function(x) { return moment(x.updated).format(config("dateFormat")); },
	updatedBy: "updatedBy"
});

require("../mapper").define("issue-view-model", "issue", {
	"_id": "id",
	name: "description",
	details: "details",
	number: "number",
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
	type: "type",
	typeId: "typeId",
	opened: function(x) { return moment(x.opened, config("dateFormat")); },
	closed: function(x) { return x.closed == "" || x.closed == null ? null : moment(x.closed, config("dateFormat")); }
});