var crypto = require("crypto");
var config = require("../config");

exports.hash = function(plaintext) {
	var blah =  crypto.createHash(config.call(this, "hashAlgorithm")).update(plaintext).digest("hex");
	return blah;
};