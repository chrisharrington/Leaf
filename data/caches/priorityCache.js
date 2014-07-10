var repositories = require("../repositories");

module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories/priorityRepository"),
	sort: { order: -1 }
});