module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").User,
	sort: { name: 1 }
});