(function(root) {

	var _container;
	var _menu;

	root.init = function(container, trigger) {
		IssueTracker.SlideMenu.build(container, trigger);

		IssueTracker.UserSettings.EmailNotifications.init("#email-notification-settings-template", "#email-notification-settings-trigger");
	}

})(root("IssueTracker.UserSettings"));