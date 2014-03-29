var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Notification
});

repository.user = function(user) {
    return this.model.findAsync({ user: user._id, isViewed: false });
};

module.exports = repository;

