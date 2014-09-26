IssueTracker.app.factory("authentication", function($rootScope, $http) {
	var that;
	return that = {
		isSignedIn: function() {
			return $rootScope.user !== undefined;
		},

		check: function() {
			if (!that.isSignedIn())
				window.location.hash = "welcome";
		},

		signIn: function(emailAddress, password, staySignedIn) {
			return $http.post("sign-in", { email: emailAddress, password: password }).then(function(data) {
				$rootScope.user = data.data.user;
				$rootScope.project = data.data.project;
				(staySignedIn ? window.localStorage : window.sessionStorage).setItem("session", JSON.stringify(data.data));
			});
		}
	}
});