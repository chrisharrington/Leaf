var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

module.exports = {
	view: function(location, response) {
		return fs.readFileAsync(location).then(function(html) {
			response.send(html, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	}
};