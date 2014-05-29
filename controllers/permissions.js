var Promise = require("bluebird");
var bundler = require("../bundling/bundler");
var assets = require("../bundling/assets");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var authorize = require("../authentication/authorize");

module.exports = function(app) {
	app.post("/permissions", authenticate, authorize("modify-user-permissions"), function (request, response) {
		return repositories.UserPermission.removeAllForUser(request.body.userId).then(function() {
			return repositories.UserPermission.addPermissionsForUser(request.body.userId, request.body.permissionIds || []);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};