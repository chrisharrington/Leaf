var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

module.exports = {
	view: function(location, response, model) {
		return fs.readFileAsync(location).then(function(html) {
			response.send(model ? mustache.render(html.toString(), model) : html, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	}
};