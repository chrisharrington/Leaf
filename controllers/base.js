var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

var _rootContent;

exports.inject = function(html) {
	_getRootContent().then(function(content) {
		response.send(mustache.render(root, { body: html }));
	}).catch(function(e) {
		var message = "Error while rendering root content: " + e;
		console.log(message);
		response.send(message, 500);
	});
};

function _getRootContent() {
	if (_rootContent)
		return Promise.resolve(_rootContent);

	return fs.readFileAsync("../view/root.html").then(function(content) {
		return _rootContent = content;
	});
}