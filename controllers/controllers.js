module.exports = {
	root: require("./root"),
	welcome: require("./welcome"),
	issues: require("./issues"),
	notifications: require("./notifications"),
	style: require("./style"),
	users: require("./users"),
	search: require("./search"),
	projects: require("./projects"),
	milestones: require("./milestones"),

	init: function(app) {
		for (var name in this)
			if (name != "init")
				this[name].call(this, app);
	}
};