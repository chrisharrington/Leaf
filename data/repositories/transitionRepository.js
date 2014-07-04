var repository = Object.spawn(require("./baseRepository"), {
	type: "transitions"
});

repository.status = function(statusId) {
	return repository.get({ "fromId": statusId });
};

module.exports = repository;