IssueTracker.ANIMATION_SPEED = 250;

IssueTracker.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

IssueTracker.app.config(function($routeProvider) {
	$routeProvider
		.when("/welcome", { templateUrl: "views/welcome.html", controller: "welcome" })
		.when("/issues", { templateUrl: "views/issues.html", controller: "issues" })
		.when("/users", { templateUrl: "views/users.html", controller: "users" })
		.when("/profile", { templateUrl: "views/profile.html", controller: "profile" })
		.otherwise({ redirectTo: "/welcome" });
});

IssueTracker.app.run(function($rootScope, settings, profile) {
	var session = _tryGetSession(window.sessionStorage);
	if (!session)
		session = _tryGetSession(window.localStorage);
	if (session) {
		$rootScope.project = session.project;
		$rootScope.user = session.user;
	}

	$rootScope.settings = settings;
	$rootScope.profile = profile;

//	$(document).on("click", function(e) {
//		$rootScope.$broadcast("documentClicked", $(e.target));
//	});
//
//	$(window).on("keyup", function(e) {
//		if (e.keyCode === 27)
//			$rootScope.$broadCast("escapePressed", e);
//	});

	function _tryGetSession(storage) {
		return JSON.parse(storage.getItem("session"));
	}
});