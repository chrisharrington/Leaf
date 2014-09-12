IssueTracker.app.directive("gravatar", function(crypto) {
	return {
		restrict: "E",
		templateUrl: "templates/gravatar.html",
		scope: {
			email: "@",
			size: "@"
		},
		link: function(scope) {
			scope.hash = crypto.md5(scope.email);
		}
	}
});