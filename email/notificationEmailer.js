var emailer = require("./emailer");

exports.issueAssigned = function(user, issue) {
	return _send(user, issue, "./templates/issueAssigned.html", "Leaf - Issue Assigned");
};

exports.issueUpdated = function(user, issue) {
	return _send(user, issue, "./templates/issueUpdated.html", "Leaf - Issue Updated");
};

exports.issueDeleted = function(user, issue) {
	return _send(user, issue, "./templates/issueDeleted.html", "Leaf - Issue Deleted");
};

function _send(user, issue, file, subject) {
	return emailer.send(file, {
		user: user,
		issue: issue,
		formattedProjectName: issue.project.name.formatForUrl()
	}, user.emailAddress, subject);
}

exports.newComment = function(user, issue, comment) {
	return emailer.send("./templates/newComment.html", {
		user: user,
		issue: issue,
		comment: comment,
		formattedProjectName: issue.project.name.formatForUrl()
	}, user.emailAddress, "Leaf - New Comment");
};