exports.restoreStubs = function(stubs) {
	for (var name in stubs)
		if (stubs[name].restore)
			stubs[name].restore();
};