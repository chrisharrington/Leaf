var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    property: String,
    oldValue: String,
    newValue: String,
    
    issueAudit: { type: objectId, ref: "issue-audit" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("audit", schema));