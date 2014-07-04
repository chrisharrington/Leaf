var repository = Object.spawn(require("./baseRepository"), {
	type: "comments"
});

repository.issue = function(issueId) {
	return this.connection()
		.select("comments.*", "users.name as user")
		.join("users", "comments.userId", "users.id")
		.where({ issueId: issueId }).orderBy("comments.created_at", "desc");
};

module.exports = repository;