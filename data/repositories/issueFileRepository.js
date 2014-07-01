var repository = Object.spawn(require("./baseRepository"), {
	table: "issuefiles"
});

repository.issue = function(issueId) {
	return this.connection().where({ issueId: issueId }).orderBy("name");
};

module.exports = repository;