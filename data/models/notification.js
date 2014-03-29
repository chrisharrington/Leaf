var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    type: String,
    isDeleted: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },

    issue: { type: objectId, ref: "issue" },
    user: { type: objectId, ref: "user" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("notification", schema));