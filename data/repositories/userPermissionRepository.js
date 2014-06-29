var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	table: "userpermissions"
});

repository.removeAllForUser = function (userId) {
	return this.connection().where({ userId: userId }).del();
};

repository.addPermissionsForUser = function (userId, permissionIds) {
	var creates = [], model = this.model, connection = this.connection();
	permissionIds.forEach(function(permissionId) {
		creates.push(connection.insert({ userId: userId, permission: permissionId }));
	});
	return Promise.all(creates);
};

repository.getForUserIds = function(userIds) {
	return this.conncetion().whereIn("userId", userIds);
};

module.exports = repository;