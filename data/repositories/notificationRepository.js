var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Notification
});

repository.user = function(user) {
	return repository.get({ user: user._id, isViewed: false }, "issue");
};

repository.markAsRead = function(notificationId) {
    return repository.details(notificationId).then(function(notification) {
        notification.isViewed = true;
        return Promise.promisifyAll(notification).saveAsync();
    });
};

repository.removeForIssue = function(issueId) {
	var me = this;
	return this.model.findAsync({ issue: issueId }).then(function(notifications) {
		var all = [];
		for (var i = 0; i < notifications.length; i++)
			all.push(Promise.promisifyAll(notifications[i]).removeAsync());
		return Promise.all(all);
	});
};

module.exports = repository;

