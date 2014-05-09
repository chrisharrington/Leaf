
(function (root) {

	var _bar;

	root.init = function () {
		_setupHighcharts();
		_setupNanobar();
		_setupAjaxPrefilters();
		_setupPath();

		document.cookie = "timezoneOffset=" + new Date().getTimezoneOffset();

        IssueTracker.Notifications.init($("div.notifications"), $("#notifications"));
		IssueTracker.UserSettings.init($("div.user-information"));
		IssueTracker.Settings.init($("div.settings.slide-menu"));
		ko.applyBindings(IssueTracker);
	};
	
	function _setupPath() {
		if (IssueTracker.projectId())
			Path.root("#/issues");
		else
			Path.root("#/welcome");
		Path.rescue(function () {
			$("div.error404").show();
			$("section.content-container").hide();
		});
		Path.listen();
	}

	function _setupHighcharts() {
		Highcharts.setOptions({
			colors: ["#D42C2C", "#2F7ED8", "#FA9141", "#1AADCE", "#8BBC21", "#0D233A"]
		});
	}

	function _setupNanobar() {
		_bar = new Nanobar({
			bg: "#4FB53C",
			target: $("div.bar-container")[0]
		});
		
		$(document).ajaxSend(function () {
			_bar.go(15);
		}).ajaxComplete(function () {
			_bar.go(100);
		});
	}

	function _setupAjaxPrefilters() {
		$.ajaxPrefilter(function (options, original) {
			if (IssueTracker.projectId())
				options.data = $.param($.extend(original.data, { projectId: IssueTracker.projectId() }));
		});
	}

})(root("IssueTracker.Init"));