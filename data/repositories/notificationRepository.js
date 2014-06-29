var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	table: "notifications"
});

repository.user = function(user) {
	return repository.get({ userId: user.id, isViewed: false }, "issue");
};

repository.markAsRead = function(notificationId) {
    return repository.details(notificationId).then(function(notification) {
        notification.isViewed = true;
        return Promise.promisifyAll(notification).saveAsync();
    });
};

repository.removeForIssue = function(issueId) {
	return repository.get({ issue: issueId }).then(function(notifications) {
		return Promise.map(notifications, function(notification) {
			return Promise.promisifyAll(notification).removeAsync();
		});
	});
};

module.exports = repository;

