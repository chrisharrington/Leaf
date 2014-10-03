IssueTracker.app.service("settings", function($rootScope) {
	this.visible = false;

	this.show = function() {
		this.visible = true;
	};

	this.signOut = function() {
		this.visible = false;
		$rootScope.user = null;
		$rootScope.project = null;
		window.localStorage.removeItem("session");
		window.sessionStorage.removeItem("session");
		window.location.hash = "welcome";
	};
});