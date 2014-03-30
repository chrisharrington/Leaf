var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Notification
});

repository.user = function(user) {
	var me = this;
	return new Promise(function(resolve, reject) {
		me.model.find({ user: user._id, isViewed: false }).populate("issue").exec(function(err, notifications) {
			if (err) reject(err);
			else resolve(notifications);
		});
	});
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

