
(function (root) {

	var _bar;

	root.init = function () {
		_setupPath();
		_setupHighcharts();
		_setupNanobar();
		_setupAjaxPrefilters();

		document.cookie = "timezoneOffset=" + new Date().getTimezoneOffset();

		IssueTracker.Header.init();
        IssueTracker.Notifications.init($("div.notifications"), $("#notifications"));
		IssueTracker.UserSettings.init($("div.user-settings"), $("#user-settings"));
		$(document).on("click", "#sign-out-trigger", _signOut);
		ko.applyBindings(IssueTracker);
	};
	
	function _setupPath() {
		if (IssueTracker.selectedProject())
			Path.root("#/" + IssueTracker.selectedProject().name.formatForUrl() + "/issues");
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
			if (IssueTracker.selectedProject())
				options.data = $.param($.extend(original.data, { projectId: IssueTracker.selectedProject().id }));
		});
	}

	function _signOut() {
		document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		IssueTracker.selectedProject(null);
		IssueTracker.signedInUser(null);
		IssueTracker.Welcome.navigate();
	}

})(root("IssueTracker.Init"));