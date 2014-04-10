var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Comment
});

repository.issue = function(issueId) {
	return this.one({ "issue": issueId }, "issue user");
};

module.exports = repository;