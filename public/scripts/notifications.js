(function(root) {

	var NOTIFICATION_LOAD_INTERVAL = 60000;
    var ANIMATION_SPEED = 350;
    var HEADER_HEIGHT = 60;

    var _container;
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

    root.init = function(container) {
		_menu = IssueTracker.SlideMenu.build(container);
        _container = container;
		_loadNotifications();

		setInterval(_loadNotifications, NOTIFICATION_LOAD_INTERVAL);

        _container.on("click", ".mark-as-viewed", _markAllAsViewed);
    };

	root.show = function() {
		_menu.show();
	};

	root.refresh = function() {
		_loadNotifications();
	};

	root.navigateToIssue = function(issueNumber, notificationId) {
		_markAsViewed([notificationId]);
        IssueTracker.IssueDetails.navigate({ number: issueNumber });
    };

	function _loadNotifications() {
		root.loading(true);
        $.ajax({
            url: IssueTracker.virtualDirectory + "notifications",
            global: false
        }).done(function(notifications) {
			root.notifications.removeAll();
			for (var i = 0; i < notifications.length; i++)
				root.notifications.push(IssueTracker.Utilities.createPropertyObservables(notifications[i]));
            _setIconHeights();
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
		return $.post(IssueTracker.virtualDirectory + "notifications/mark-as-viewed", { notificationIds: notificationIds.join(",") }).done(function() {
			$(root.notifications()).each(function() {
				this.isViewed(true);
			});
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while setting your notifications to read. Please try again later.");
		});
	}

})(root("IssueTracker.Notifications"));