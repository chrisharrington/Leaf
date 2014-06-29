module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").Transition,
	sort: { name: 1 }
});