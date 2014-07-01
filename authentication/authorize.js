var repositories = require("../data/repositories");
var Promise = require("bluebird");

module.exports = function(permission) {
	return function(request, response, next) {
		return repositories.Permission.one({ tag: permission }).then(function(permission) {
			return repositories.UserPermission.one({ userId: request.user.id, permissionId: permission.id });
		}).then(function(userPermission) {
			if (userPermission)
				next();
			else
				response.send(401);
		}).catch(function() {
			response.send(401);
		});
	};
};