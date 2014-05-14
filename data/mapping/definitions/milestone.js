require("../mapper").define("milestone", "milestone-view-model", {
	"id": "_id",
	name: "name",
	order: "order"
});

require("../mapper").define("milestone-view-model", "milestone", {
	"_id": "id",
	name: "name",
	order: "order"
});

