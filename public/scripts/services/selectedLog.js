IssueTracker.app.factory("selectedLog", function() {
	return {
		get: function() {
			if (!Logger.selectedLog) {
				var raw = window.localStorage.getItem("selected-log");
				if (raw)
					Logger.selectedLog = JSON.parse(raw);
			}
			return Logger.selectedLog;
		},

		set: function(log) {
			window.localStorage.setItem("selected-log", JSON.stringify(log));
			Logger.selectedLog = log;
		}
	}
});