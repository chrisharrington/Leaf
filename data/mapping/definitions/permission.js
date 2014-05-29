var moment = require("moment");
var config = require("../../../config");

require("../mapper").define("permission", "permission-view-model", {
	id: "_id",
	name: "name",
	tag: "tag"
});