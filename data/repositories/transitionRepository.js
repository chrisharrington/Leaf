var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Transition
});

repository.status = function(statusId) {
	return this.model.findAsync({ "from._id": statusId }).catch(function(e) {
		console.log("Error during transitionRepository.status: " + e);
	})
};

module.exports = repository;