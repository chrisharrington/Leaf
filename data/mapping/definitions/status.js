require("../mapper").define("status", "status-view-model", {
	"id": "id",
	name: "name",
	order: "order",
	isClosedStatus: "isClosedStatus",
	isDeveloperStatus: "isDeveloperStatus",
	isTesterStatus: "isTesterStatus"
});

require("../mapper").define("status-view-model", "status", {
	"id": "id",
	name: "name",
	order: "order",
	isClosedStatus: "isClosedStatus",
	isDeveloperStatus: "isDeveloperStatus",
	isTesterStatus: "isTesterStatus"
});