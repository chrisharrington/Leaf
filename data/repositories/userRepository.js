var Promise = require("bluebird");

module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").User
});