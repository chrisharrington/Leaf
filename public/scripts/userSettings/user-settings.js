(function(root) {

	root.visible = ko.observable(false);

	root.init = function() {
		IssueTracker.UserSettings.EmailNotifications.init("#email-notification-settings-template", "#email-notification-settings-trigger");

		$(document).on("click", function () {
			if (root.visible())
				root.visible(false);
		});
	};

	root.show = function() {
		setTimeout(function() {
			root.visible(true);
		}, 5);
	};

	root.signOut = function() {
		document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		IssueTracker.Welcome.navigate();
		IssueTracker.projectId(null);
		IssueTracker.projectName(null);
		IssueTracker.signedInUser(null);
	};

})(root("IssueTracker.UserSettings"));