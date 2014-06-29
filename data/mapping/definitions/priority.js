require("../mapper").define("priority", "priority-view-model", {
	"id": "id",
	name: "name",
	order: "order",
	colour: "colour"
});

require("../mapper").define("priority-view-model", "priority", {
	"id": "id",
	name: "name",
	order: "order",
	colour: "colour"
});