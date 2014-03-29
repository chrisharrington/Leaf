(function(root) {

	var NOTIFICATION_LOAD_INTERVAL = 60000;

	root.loading = ko.observable(false);
	root.notifications = ko.observableArray();

    root.init = function() {
		_loadNotifications();

		setInterval(_loadNotifications, NOTIFICATION_LOAD_INTERVAL);

		$(document).on("click", "#notifications", _show);
    };

	root.navigateToIssue = function(issueNumber) {
		alert(issueNumber);
	};

	function _show() {
		
	}

	function _loadNotifications() {
		root.loading(true);
		$.get(IssueTracker.virtualDirectory() + "notifications").done(function(notifications) {
			root.notifications.removeAll();
			for (var i = 0; i < notifications.length; i++)
				root.notifications.push(IssueTracker.Utilities.createPropertyObservables(notifications[i]));
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while retrieving your notifications. Please contact technical support.");
		}).always(function() {
			root.loading(false);
		});
	}

})(root("IssueTracker.Notifications"));