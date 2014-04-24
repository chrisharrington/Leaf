require("../mapper").define("user", "user-summary-view-model", {
	"id": "_id",
	name: "name",
	emailAddress: "emailAddress",
	isActivated: function(x) { return x.activationToken == null; }
});