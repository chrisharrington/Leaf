IssueTracker.app.factory("settings", function($rootScope) {
	return {
		init: function() {
			$rootScope.settings = {
				visible: false,

				show: function() {
					$rootScope.settings.visible = true;
				},

				signOut: function() {
					$rootScope.settings.visible = false;
					$rootScope.user = null;
					$rootScope.project = null;
					window.localStorage.removeItem("session");
					window.sessionStorage.removeItem("session");
					window.location.hash = "welcome";
				}
			};
		}
	};
});