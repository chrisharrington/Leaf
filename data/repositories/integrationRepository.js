var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Integration
});

repository.name = function(name) {
	return repository.get({ name: name.toLowerCase() });
};

module.exports = repository;