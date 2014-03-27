var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    isDeleted: { type: Boolean, default: false },
	container: String,
	name: String,

    issue: { type: objectId, ref: "issue" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue-file", schema));