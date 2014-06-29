var repository = Object.spawn(require("./baseRepository"), {
	table: "transitions"
});

repository.status = function(statusId) {
	return repository.get({ "fromId": statusId });
};

module.exports = repository;