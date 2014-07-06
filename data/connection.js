var Promise = require("bluebird");
var mongoose = require("mongoose");
var config = require("../config");

exports.open = function() {
	return new Promise(function(resolve) {
		resolve();
	});
};