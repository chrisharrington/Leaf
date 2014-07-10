module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").Milestone,
	sort: { order: 1 }
});