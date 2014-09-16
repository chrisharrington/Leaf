IssueTracker.app.controller("welcome", function($scope, welcome, once) {
	once("welcome", function() { welcome.init($scope); });
	welcome.methods($scope);
	welcome.load($scope);
});

IssueTracker.app.factory("welcome", function(feedback, $http) {
	return {
		init: function(scope) {
			scope.loading = false;
			scope.emailAddress = "chrisharrington99@gmail.com";
			scope.password = "test";
			scope.staySignedIn = false;
		},

		load: function(scope) {
		},

		methods: function(scope) {
			scope.signIn = function() {
				var error = _validate(scope);
				if (error)
					feedback.error(error);
				else
				_submit(scope);
			};
		}
	};

	function _validate(scope) {
		if (scope.emailAddress === "")
			return "The email address is required.";
		if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(scope.emailAddress))
			return "The email address is invalid.";
		if (scope.password === "")
			return "The password is required.";
	}

	function _submit(scope) {
		scope.loading = true;
		$http.post("sign-in", { email: scope.emailAddress, password: scope.password }).then(function() {
			_setSignInValues(data.user, data.project);
			window.location.hash = "issues";
		}, function(response) {
			if (response.status == 401)
				feedback.error("Your credentials are invalid.");
			else
				feedback.error("An error has occurred while signing you in. Please try again later.");
		}).finally(function() {
			scope.loading = false;
		});
	}

	function _setSignInValues(user, project) {
		$rootScope.signedInUser = user;
		$rootScope.project = project;
	}

});