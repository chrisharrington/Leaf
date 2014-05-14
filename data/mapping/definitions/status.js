require("../mapper").define("status", "status-view-model", {
	"id": "_id",
	name: "name",
	order: "order",
	isClosedStatus: "isClosedStatus",
	isDeveloperStatus: "isDeveloperStatus",
	isTesterStatus: "isTesterStatus"
});

require("../mapper").define("status-view-model", "status", {
	"_id": "id",
	name: "name",
	order: "order",
	isClosedStatus: "isClosedStatus",
	isDeveloperStatus: "isDeveloperStatus",
	isTesterStatus: "isTesterStatus"
});