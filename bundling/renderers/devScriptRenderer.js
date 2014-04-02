var Promise = require("bluebird");
var basePath = "public/";

exports.render = function(path) {
	return new Promise(function(resolve) {
		resolve("<script type=\"text/javascript\" src=\"" + path.replace(basePath, "") + "\"></script>\n");
	});
};