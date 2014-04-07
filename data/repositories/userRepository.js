var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue
});

repository.update = function(user) {
	return Promise.promisifyAll(user).saveAsync();
};

module.exports = repository;