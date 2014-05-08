var config = require("../config");
var crypto = require("crypto");

module.exports = function(text) {
	return crypto.createHash(config.call(this, "hashAlgorithm")).update(text).digest("hex");
};