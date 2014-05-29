var repositories = require("../data/repositories");
var models = require("../data/models");
var Promise = require("bluebird");

module.exports = function(permission) {
	return function(request, response, next) {
		return repositories.Permission.one({ tag: permission }).then(function(permission) {
			return repositories.UserPermission.one({ permission: permission._id });
		}).then(function(userPermission) {
			if (userPermission)
				next();
			else
				response.send(401);
		});
	};
};