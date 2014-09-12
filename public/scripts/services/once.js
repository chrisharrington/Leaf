IssueTracker.app.factory("once", function() {
	var keys = {};

	return function(key, func) {
		if (keys[key])
			return;

		keys[key] = true;
		func();
	};
});