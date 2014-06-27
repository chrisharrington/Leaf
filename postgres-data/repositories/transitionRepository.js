var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Transition
});

repository.status = function(statusId) {
	return repository.get({ "from._id": statusId });
};

module.exports = repository;