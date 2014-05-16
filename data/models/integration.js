var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	name: String,
	isDeleted: { type: Boolean, default: false },
	numberMatch: String,
	authorizationToken: String,

	project: { type: objectId, ref: "project" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("integration", schema));