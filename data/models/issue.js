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
	priorityOrder: { type: Number },
	developerId: objectId,
	testerId: objectId,
	statusId: { type: objectId },
	milestoneId: { type: objectId },
	typeId: objectId,
	updatedById: objectId,
	updatedBy: String,
    project: { type: objectId, ref: "project" }
});

schema.plugin(require("mongoose-text-search"));

schema.index({ priorityOrder: 1, number: 1 });
schema.index({ developerId: 1 });
schema.index({ testerId: 1 });
schema.index({ name: "text", details: "text" });

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));