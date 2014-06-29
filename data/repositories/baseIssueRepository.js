var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	table: "comments"
});

repository.issue = function(issueId, populate) {
	return this.get({ "issue": issueId, isDeleted: false }, populate || this.populate);
};

module.exports = repository;