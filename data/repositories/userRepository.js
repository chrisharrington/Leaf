module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").User,
	sort: { name: 1 }
});