var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    isDeleted: { type: Boolean, default: false }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("project", schema));