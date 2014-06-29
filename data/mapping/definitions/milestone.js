require("../mapper").define("milestone", "milestone-view-model", {
	"id": "id",
	name: "name",
	order: "order"
});

require("../mapper").define("milestone-view-model", "milestone", {
	"id": "id",
	name: "name",
	order: "order"
});

