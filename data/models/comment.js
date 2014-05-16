var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    isDeleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    text: String,
	type: { type: String, default: "user-comment" },
	url: { type: String, default: null },
	commit: { type: String, default: null },
    
    issue: { type: objectId, ref: "issue" },
    user: { type: objectId, ref: "user" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("comment", schema));