module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").Project,
	sort: { name: 1 }
});