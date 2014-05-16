var repositories = require("../../data/repositories");

exports.handle = function(integration, payload) {
	return Promise.all(payload.commits.map(function(commit) {
		return _handleCommit(commit, integration);
	}));
};

function _handleCommit(commit, integration) {
	var regex = new RegExp(integration.numberMatch);
	if (!regex.test(commit.message))
		return;

	return Promise.all([
		repositories.Issue.one({ number: regex.exec(commit.message) }),
		repositories.User.one({ emailAddress: commit.author.email })
	]).spread(function(issue, user) {
		return repositories.Comment.create({
			text: commit.message,
			type: "github",
			url: commit.url,
			commit: commit.id,
			issue: issue._id,
			user: user ? user._id : null
		});
	});
}