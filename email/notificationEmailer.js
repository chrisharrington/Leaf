var config = require("../config");
var Promise = require("bluebird");
var sendgrid  = require("sendgrid").call((this, config("sendgridUsername"), config("sendgridPassword")));
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

exports.issueAssigned = function(user, issue) {
	return _render("./templates/issueAssigned.html", {
		user: user,
		issue: issue,
		formattedProjectName: issue.project.name.formatForUrl()
	}).then(function(rendered) {
		return _send(user.emailAddress, "Leaf - Issue Assigned to You", rendered);
	});
};

function _render(file, model) {
	return fs.readFileAsync(file).then(function(html) {
		return mustache.render(html, model);
	});
}

function _send(emailAddress, subject, html) {
	return new Promise(function(resolve, reject) {
		sendgrid.send({
			to: emailAddress,
			from: config.fromAddress,
			subject: subject,
			html: html
		}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

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