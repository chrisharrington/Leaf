IssueTracker.app.controller("welcome", function($scope, welcome, once) {
	once("welcome", function() { welcome.init($scope); });
	welcome.methods($scope);
	welcome.load($scope);
});

IssueTracker.app.factory("welcome", function(feedback) {
	return {
		init: function(scope) {
			scope.loading = false;
			scope.emailAddress = "chrisharrington99@gmail.com";
			scope.password = "";
			scope.staySignedIn = false;
		},

		load: function(scope) {
		},

		methods: function(scope) {
			scope.signIn = function() {
				var error = _validate(scope);
				if (error)
					feedback.error(error);
			};
		}
	};

	function _validate(scope) {
		if (scope.emailAddress === "")
			return "The email address is required.";
		if (scope.password === "")
			return "The password is required.";
	}
});