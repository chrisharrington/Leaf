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
	priorityId: { type: objectId },
	priority: String,
	priorityOrder: { type: Number },
	developerId: objectId,
    developer: String,
	testerId: objectId,
	tester: String,
	statusId: { type: objectId },
	status: String,
	statusOrder: Number,
	milestoneId: { type: objectId },
	milestone: String,
	milestoneOrder: Number,
	typeId: objectId,
	type: String,
	updatedById: objectId,
	updatedBy: String,
    project: { type: objectId, ref: "project" }
});

schema.plugin(require("mongoose-text-search"));

schema.index({ priorityOrder: -1, number: 1 });
schema.index({ developerId: 1 });
schema.index({ testerId: 1 });
schema.index({ name: "text", details: "text" });

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));