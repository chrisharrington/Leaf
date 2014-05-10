var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	_id: String,
	sequence: Number
});

module.exports = require("bluebird").promisifyAll(mongoose.model("sequence", schema));