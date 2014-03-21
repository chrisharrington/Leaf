var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
	details: String,
    number: Number,
    isDeleted: { type: Boolean, default: false },
    opened: { type: Date, default: Date.now },
    closed: Date,
    updated: { type: Date, default: Date.now },
    description: String,
    
    developer: { type: objectId, ref: "user" },
    tester: { type: objectId, ref: "user" },
    priority: { type: objectId, ref: "priority" },
    status: { type: objectId, ref: "status" },
    milestone: { type: objectId, ref: "milestone" },
    type: { type: objectId, ref: "issue-type" },
    updatedBy: { type: objectId, ref: "user" },
    project: { type: objectId, ref: "project" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));