IssueTracker.app.directive("profileImage", function($rootScope, md5) {
	return {
		restrict: "E",
		templateUrl: "templates/profileImage.html",
		scope: {
			size: "@",
			id: "="
		},
		link: function(scope, element, attributes) {
			scope.hasTooltip = attributes.showTooltip !== undefined;
			var user = $rootScope.users.dict("id")[scope.id];
			scope.location = "http://gravatar.com/avatar/" + md5.createHash(user.emailAddress) + "?s=" + (scope.size || 35);
			scope.name = user.name;
		}
	}
});