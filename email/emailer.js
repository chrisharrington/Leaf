var config = require("../config");
var Promise = require("bluebird");
var sendgrid  = require("sendgrid");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

exports.send = function(file, model, recipients, subject) {
	if (!(recipients instanceof Array))
		recipients = [recipients];
	return _render(file, model).then(function(rendered) {
		return Promise.map(recipients, function(recipient) {
			return _send(recipient, subject, rendered);
		});
	});
};

function _render(file, model) {
	return fs.readFileAsync(file).then(function(html) {
		return mustache.render(html.toString(), model);
	});
}

function _send(emailAddress, subject, html) {
	var emailer = sendgrid.call(this, config.call(this, "sendgridUsername"), config.call(this, "sendgridPassword"));
	return new Promise(function(resolve, reject) {
		emailer.send({
			to: emailAddress,
			from: config.call(this, "fromAddress"),
			subject: subject,
			html: html
		}, function(err) {
			if (err) reject(new Error(err));
			else resolve();
		});
	});
}