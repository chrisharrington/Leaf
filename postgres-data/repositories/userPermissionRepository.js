var Promise = require("bluebird");

module.exports = function(connection) {
	var repository = Object.spawn(require("./baseRepository"), {
		table: "userpermissions",
		connection: connection
	});

	repository.removeAllForUser = function (userId) {
		return this.model.removeAsync({ user: userId });
	};

	repository.addPermissionsForUser = function (userId, permissionIds) {
		var creates = [], model = this.model;

		permissionIds.forEach(function (permissionId) {
			creates.push(new Promise(function (resolve, reject) {
				model.create({}).complete(function (err, created) {
					if (err)
						reject(err);
					else
						created.setUser
				});
			}));
		});
		return Promise.all(creates);
	};

	return module.exports = repository;
};