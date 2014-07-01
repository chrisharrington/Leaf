var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	table: "userpermissions"
});

repository.removeAllForUser = function (userId) {
	return this.connection().where({ userId: userId }).del();
};

repository.addPermissionsForUser = function (userId, permissionIds) {
	var creates = [], model = this.model, that = this;
	for (var i = 0; i < permissionIds.length; i++)
		creates.push(that.connection().insert({ created_at: new Date(), updated_at: new Date(), userId: parseInt(userId), permissionId: parseInt(permissionIds[i]) }));
	return Promise.all(creates);
};

repository.users = function(userIds) {
	return this.connection().whereIn("userId", userIds);
};

module.exports = repository;