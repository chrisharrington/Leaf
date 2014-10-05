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
    $rootScope.settings = settings;
	$rootScope.profile = profile;
    
	_setSessionData();

    function _setSessionData() {
        var session = _tryGetSession(window.sessionStorage);
        if (!session)
            session = _tryGetSession(window.localStorage);
        if (session) {
            $rootScope.project = session.project;
            $rootScope.user = session.user;
        }  
    }
    
	function _tryGetSession(storage) {
		return JSON.parse(storage.getItem("session"));
	}
});