var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Sequence
});

repository.next = function(name) {
	return this.model.findOneAndUpdateAsync({
		_id: name
	}, {
		$inc: { sequence: 1 }
	}, {
		new: true,
		upsert: true
	}).then(function(document) {
		return document.sequence;
	});
};

module.exports = repository;