var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	user: { type: objectId, ref: "user" },
	permission: { type: objectId, ref: "permission" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("userPermission", schema));