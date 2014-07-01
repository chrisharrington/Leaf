var config = require("../../../config");

require("../mapper").define("user-permission", "user-permission-view-model", {
	userId: "userId",
	permissionId: "permissionId"
});