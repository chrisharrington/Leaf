var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var mapper = require("../data/mapper");
var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/notifications", authenticate, function(request, response) {
		return repositories.Notification.user(request.user).then(function(notifications) {
			return mapper.mapAll("notification", "notification-view-model", notifications);
		}).then(function(mapped) {
			response.send(mapped, 200);
		}).catch(function(e) {
			response.send("Error while retrieving notifications: " + e, 500);
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

	app.post("/notifications/email", authenticate, function(request, response) {
		repositories.User.details(request.user.id).then(function(user) {
			user.emailNotificationForIssueAssigned = request.body.emailNotificationForIssueAssigned;
			user.emailNotificationForIssueDeleted = request.body.emailNotificationForIssueDeleted;
			user.emailNotificationForIssueUpdated = request.body.emailNotificationForIssueUpdated;
			user.emailNotificationForNewCommentForAssignedIssue = request.body.emailNotificationForNewCommentForAssignedIssue;
			return Promise.promisifyAll(user).saveAsync();
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error while updating email notification settings: " + e;
			console.log(message);
			response.send(message, 500);
		})
	});
};