var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	user: { type: objectId, ref: "user" },
	permission: { type: objectId, ref: "permission" },
	isReadOnly: { type: Boolean, default: false }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("userPermission", schema));