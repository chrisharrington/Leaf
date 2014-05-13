require("../mapper").define("priority", "priority-view-model", {
	"id": "_id",
	name: "name",
	order: "order"
});

require("../mapper").define("priority-view-model", "priority", {
	"_id": "id",
	name: "name",
	order: "order"
});