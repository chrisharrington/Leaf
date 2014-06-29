module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").Priority,
	sort: { order: -1 }
});