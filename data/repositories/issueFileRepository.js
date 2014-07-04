var repository = Object.spawn(require("./baseRepository"), {
	type: "issuefiles"
});

repository.issue = function(issueId) {
	return this.connection().where({ issueId: issueId }).orderBy("name");
};

module.exports = repository;