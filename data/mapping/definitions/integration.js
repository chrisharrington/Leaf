require("../mapper").define("integration", "integration-view-model", {
	"id": "_id",
	name: "name",
	matcher: "matcher"
});

require("../mapper").define("integration-view-model", "integration", {
	"id": "_id",
	name: "name",
	matcher: "matcher"
});