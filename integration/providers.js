var Promise = require("bluebird");

var directory = "./providers/";
module.exports = function(key) {
	return {
		github: require(directory + "github")
	}[key];
};

