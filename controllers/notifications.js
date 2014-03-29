var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");

module.exports = function(app) {
	app.get("/notifications", authenticate, function(request, response) {
		repositories.Notification.user(request.user).then(function(notifications) {
			response.send(notifications);
		}).catch(function(e) {
			var message = "Error while retrieving notifications: " + e;
			console.log(e);
			response.send(message, 500);
		});
	});
};