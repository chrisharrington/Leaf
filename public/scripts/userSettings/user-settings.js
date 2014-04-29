(function(root) {

	var _container;
	var _menu;

	root.init = function(container, trigger) {
		_menu = IssueTracker.SlideMenu.build(container, trigger);

		IssueTracker.UserSettings.EmailNotifications.init("#email-notification-settings-template", "#email-notification-settings-trigger");
		container.on("click", "#sign-out", _signOut);
	};

	root.show = function() {
		_menu.show();
	};

	function _signOut() {
		document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		IssueTracker.Welcome.navigate();
		IssueTracker.projectId(null);
		IssueTracker.projectName(null);
		IssueTracker.signedInUser(null);
	}

})(root("IssueTracker.UserSettings"));