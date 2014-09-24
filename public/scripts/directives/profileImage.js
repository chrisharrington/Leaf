IssueTracker.app.directive("profileImage", function(md5) {
	return {
		restrict: "E",
		templateUrl: "templates/profileImage.html",
		scope: {
			size: "@",
			id: "="
		},
		link: function(scope) {
			var users = IssueTracker.users.dict("id");
			scope.location = "http://gravatar.com/avatar/" + md5.createHash(users[scope.id].emailAddress) + "?s=" + (scope.size || 35);
		}
	}
});