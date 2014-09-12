IssueTracker.app.factory("authentication", function($rootScope, $q) {
	var that;
	return that = {
		isSignedIn: function() {
			return $rootScope.user !== undefined;
		},

		check: function() {
			if (!that.isSignedIn())
				window.location.hash = "sign-in";
		},

		signIn: function(emailAddress, password) {
			var deferred = $q.defer();
			setTimeout(function() {
				$rootScope.user = {
					email: "chrisharrington99@gmail.com"
				};
				deferred.resolve(true);
			}, 1000);
			return deferred.promise;
		}
	}
});