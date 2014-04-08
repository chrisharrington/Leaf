var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").User
});

repository.update = function(user) {
	return Promise.promisifyAll(user)saveAsync();
};

module.exports = repository;