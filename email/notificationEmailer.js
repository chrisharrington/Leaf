var emailer = require("./emailer");

exports.issueAssigned = function(user, issue) {
	return emailer.send("./templates/issueAssigned.html", {
		user: user,
		issue: issue,
		formattedProjectName: issue.project.name.formatForUrl()
	}, user.emailAddress, "Leaf - Issue Assigned");
};

exports.issueUpdated = function(user, issue) {
	return new Promise(function(resolve, reject) {
		var text = "Hi " + user.name + "<br><br>";
		text += "An issue that's assigned to you has been updated. Here are the details:<br><br>";
		text += "#" + issue.number + " - " + issue.name + "<br><br>";
		if (issue.details)
			text += issue.details + "<br><br>";
		text += "To view this issue, click the link below.<br><br>";
		text += config.domain + "/#/" + issue.project.name.formatForUrl() + "/issues/" + issue.number + "<br><br>";
		text += "Thanks!<br>Leaf";

		sendgrid.send({
			to: user.emailAddress,
			from: config.fromAddress,
			subject: "Leaf - Issue Updated",
			html: text
		}, function (err) {
			if (err) reject("Error while sending issue assigned email: " + err);
			else resolve();
		});
	});
};

exports.issueDeleted = function(user, issue) {
	return new Promise(function(resolve, reject) {
		var text = "Hi " + user.name + "<br><br>";
		text += "An issue that's assigned to you has been deleted. Here are the details:<br><br>";
		text += "#" + issue.number + " - " + issue.name + "<br><br>";
		if (issue.details)
			text += issue.details + "<br><br>";
		text += "To view this issue, click the link below.<br><br>";
		text += config.domain + "/#/" + issue.project.name.formatForUrl() + "/issues/" + issue.number + "<br><br>";
		text += "Thanks!<br>Leaf";

		sendgrid.send({
			to: user.emailAddress,
			from: config.fromAddress,
			subject: "Leaf - Issue Deleted",
			html: text
		}, function (err) {
			if (err) reject("Error while sending issue assigned email: " + err);
			else resolve();
		});
	});
};

exports.newComment = function(user, issue) {
	return new Promise(function(resolve, reject) {
		var text = "Hi " + user.name + "<br><br>";
		text += "An issue has been assigned to you. Here are the details:<br><br>";
		text += "#" + issue.number + " - " + issue.name + "<br><br>";
		if (issue.details)
			text += issue.details + "<br><br>";
		text += "To view this issue, click the link below.<br><br>";
		text += config.domain + "/#/" + issue.project.name.formatForUrl() + "/issues/" + issue.number + "<br><br>";
		text += "Thanks!<br>Leaf";

		sendgrid.send({
			to: user.emailAddress,
			from: config.fromAddress,
			subject: "Leaf - Issue Assigned to You",
			html: text
		}, function (err) {
			if (err) reject("Error while sending issue assigned email: " + err);
			else resolve();
		});
	});
};