var repositories = require("../repositories");

module.exports = Object.spawn(require("./baseCache"), {
	repository: repositories.Priority,
	sort: { order: -1 }
});