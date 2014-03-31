(function(root) {

	var NOTIFICATION_LOAD_INTERVAL = 60000;
    var ANIMATION_SPEED = 350;
    var HEADER_HEIGHT = 60;

    var _container;
    var _trigger;
	var _menu;

	root.loading = ko.observable(false);
	root.notifications = ko.observableArray();

    root.unviewedNotifications = ko.computed(function() {
        var count = 0;
        $.each(root.notifications(), function() {
            if (!this.isViewed())
                count++;
        });
        return count;
    }, root, { deferEvaluation: true });

    root.init = function(container, trigger) {
		_menu = new IssueTracker.SlideMenu(container, trigger);
        _container = container;
        _trigger = trigger;
		_loadNotifications();

		setInterval(_loadNotifications, NOTIFICATION_LOAD_INTERVAL);

		_trigger.on("click", _menu.show);
        _container.on("click", ".mark-as-viewed", _markAllAsViewed);

        $(document).on("click", function (e) {
            var itemClicked = _wasNotificationClicked($(e.target));
            if (!_container.is(":hidden") && !itemClicked)
                _menu.hide();
        });
    };

	root.refresh = function() {
		_loadNotifications();
	};

	root.navigateToIssue = function(issueNumber, notificationId) {
		_markAsViewed([notificationId]);
        IssueTracker.IssueDetails.navigate({ "project-name": IssueTracker.selectedProject().name.formatForUrl(), number: issueNumber });
    };

    function _wasNotificationClicked(context) {
        for (var i = 0; i < _trigger.length; i++) {
            if ($(_trigger[i]).attr("id") == context.attr("id") || context.parents().filter("#" + $(_trigger[i]).attr("id")).length > 0)
                return true;
        }
        return false;
    }

	function _loadNotifications() {
		root.loading(true);
        $.ajax({
            url: IssueTracker.virtualDirectory() + "notifications",
            global: false
        }).done(function(notifications) {
			root.notifications.removeAll();
			for (var i = 0; i < notifications.length; i++)
				root.notifications.push(IssueTracker.Utilities.createPropertyObservables(notifications[i]));
            _setIconHeights();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while retrieving your notifications. Please contact technical support.");
		}).always(function() {
			root.loading(false);
		});
	}

    function _setIconHeights() {
        _container.find("i.fa").each(function() {
            var height = $(this).parent().height();
            $(this).css({ "line-height": height + "px", "height" : height + "px" });
        });
    }

    function _markAllAsViewed() {
        var notificationIds = [];
        $(root.notifications()).each(function() {
            notificationIds.push(this.id());
        });

		_markAsViewed(notificationIds);
    }

	function _markAsViewed(notificationIds) {
		return $.post(IssueTracker.virtualDirectory() + "notifications/mark-as-viewed", { notificationIds: notificationIds.join(",") }).done(function() {
			$(root.notifications()).each(function() {
				this.isViewed(true);
			});
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while setting your notifications to read. Please try again later.");
		});
	}

})(root("IssueTracker.Notifications"));