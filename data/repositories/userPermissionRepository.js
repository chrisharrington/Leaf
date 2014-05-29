var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").UserPermission
});

repository.removeAllForUser = function(userId) {
	return this.model.removeAsync({ user: userId });
};

repository.addPermissionsForUser = function(userId, permissionIds) {
	var creates = [], model = this.model;
	permissionIds.forEach(function(permissionId) {
		creates.push(model.create(new model({ user: userId, permission: permissionId })));
	});
	return Promise.all(creates);
};

module.exports = repository;