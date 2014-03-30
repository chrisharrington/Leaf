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
        return Promise.promisify(notification).saveAsync();
    });
};

module.exports = repository;

