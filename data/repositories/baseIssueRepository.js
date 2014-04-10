var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Comment
});

repository.issue = function(issueId, populate) {
	return this.one({ "issue": issueId }, populate || this.populate);
};

module.exports = repository;