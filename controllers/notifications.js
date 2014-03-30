var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var mapper = require("../data/mapper");
var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/notifications", authenticate, function(request, response) {
		repositories.Notification.user(request.user).then(function(notifications) {
			response.send(mapper.mapAll("notification", "notification-view-model", notifications));
		}).catch(function(e) {
			var message = "Error while retrieving notifications: " + e;
			console.log(e);
			response.send(message, 500);
		});
	});

    app.post("/notifications/mark-as-viewed", authenticate, function(request, response) {
        var updates = [];
        var ids = request.body.notificationIds.split(",");
        for (var i = 0; i < ids.length; i++)
            updates.push(repositories.Notification.markAsRead(ids[i]));

        Promise.all(updates).then(function() {
            response.send(200);
        }).catch(function(err) {
            var message = "Error while marking notifications as read: " + err;
            console.log(message);
            response.send(message, 500);
        });
    });
};