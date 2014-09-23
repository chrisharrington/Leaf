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

//root.getUserProfileImageLocation = function(userId, size) {
//	if (!userId && !IssueTracker.signedInUser())
//		return;
//	if (!userId)
//		userId = IssueTracker.signedInUser().id();
//	if (typeof (userId) === "Function")
//		userId = userId();
//
//	var email;
//	$.each(IssueTracker.users(), function(i, user) {
//		if (user.id() == userId)
//			email = user.emailAddress();
//	});
//	return "http://gravatar.com/avatar/" + CryptoJS.MD5(email) + "?s=" + (size || 35) +"&d=mm";
//};