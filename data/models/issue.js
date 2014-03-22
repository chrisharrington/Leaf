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
	priorityId: objectId,
	priority: String,
	priorityOrder: Number,
	developerId: objectId,
    developer: String,
	testerId: objectId,
	tester: String,
	statusId: objectId,
	status: String,
	statusOrder: Number,
	milestoneId: objectId,
	milestone: String,
	typeId: objectId,
	type: String,
	updatedById: objectId,
	updatedBy: String,
    project: { type: objectId, ref: "project" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));