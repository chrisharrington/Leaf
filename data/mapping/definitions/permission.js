var moment = require("moment");
var config = require("../../../config");

require("../mapper").define("permission", "permission-view-model", {
	id: "id",
	name: "name",
	tag: "tag"
});