var config = require("../../../config");

require("../mapper").define("user-permission", "user-permission-view-model", {
	userId: "user",
	permissionId: "permission"
});