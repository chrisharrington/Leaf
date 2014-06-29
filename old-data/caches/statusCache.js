module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").Status,
	sort: { order: 1 }
});