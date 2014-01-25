
(function (root) {

	var _container;
	var _loader;

	var _startCount = 50;
	var _issueCountToLoad = 15;
	var _start = 0;
	var _nextIssuesRunning = false;
	var _allLoaded = false;

	root.list = ko.observableArray();
	
	root.filter = ko.observable("");
	root.selectedPriority = ko.observable();
	root.selectedStatus = ko.observable();
	root.selectedDeveloper = ko.observable();
	root.selectedTester = ko.observable();

	root.sortModel = {
		direction: ko.observable("descending"),
		comparer: ko.observable("priority")
	};

	root.load = function (container) {
		_container = container;

		_loader = container.find("div.table div.loading");
		_setupLoadingMoreIssues();
		_getNextIssues(_startCount);
		_hookupEvents(container);
	};

	root.reset = function () {
		_resetFilters();
		_resetIssueList();
	};

	function _resetFilters() {
		root.selectedPriority(undefined);
		root.selectedStatus(undefined);
		root.selectedDeveloper(undefined);
		root.selectedTester(undefined);
		root.filter("");

		_loadFilters();
	}

	function _loadFilters() {
		var loading = _container.find("div.filter-tags div.loading").removeClass("hidden");
		var filters = _container.find("div.filter-tags div.filters").addClass("hidden");

		$.get(IssueTracker.virtualDirectory() + "Root/Filters", $.toDictionary({ project: IssueTracker.selectedProject() })).done(function(data) {
			IssueTracker.priorities(data.priorities);
			IssueTracker.statuses(data.statuses);
			IssueTracker.users(data.users);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while retrieving your project's filter data. Please try again later.");
		}).always(function() {
			loading.addClass("hidden");
			filters.removeClass("hidden");
		});
	}

	function _hookupEvents(container) {
		container.on("click", "table tbody tr", _selectIssue);
		container.find("#saved-filter").click(_showSavedFilters);
		container.find("#priority-filter").click(_showPriorityFilter);
		container.find("#status-filter").click(_showStatusFilter);
		container.find("#developer-filter").click(_showDeveloperFilter);
		container.find("#tester-filter").click(_showTesterFilter);
		container.find("#sort").click(_showSorter);
		container.find("#text-filter").click(_showTextFilter);
	}

	function _showSavedFilters() {
		var data = {
			priorities: IssueTracker.priorities,
			statuses: IssueTracker.statuses,
			users: IssueTracker.users
		};
		var dialogContainer = IssueTracker.Dialog.load({ templateId: "saved-filter-dialog", data: data });
	}

	function _selectIssue() {
		var issue = $.parseJSON($(this).attr("data-issue"));
		IssueTracker.selectedIssue(issue);
		IssueTracker.IssueDetails.navigate({ "project-name": IssueTracker.selectedProject().name.formatForUrl(), name: issue.name.formatForUrl() });
	}

	function _showPriorityFilter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#priority-filter-dialog", anchor: $(this) });
		popupContainer.find(">div").click(function () {
			root.selectedPriority($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-priority")));
			$(this).toggleClass("selected");
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}

	function _showStatusFilter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#status-filter-dialog", anchor: $(this) });
		popupContainer.find(">div").click(function () {
			root.selectedStatus($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-status")));
			$(this).toggleClass("selected");
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}

	function _showDeveloperFilter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#developer-filter-dialog", anchor: $(this) });
		popupContainer.find(">div").click(function () {
			root.selectedDeveloper($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-developer")));
			$(this).toggleClass("selected");
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}

	function _showTesterFilter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#tester-filter-dialog", anchor: $(this) });
		popupContainer.find(">div").click(function () {
			root.selectedTester($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-tester")));
			$(this).toggleClass("selected");
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}

	function _showSorter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#sort-dialog", model: root.sortModel, anchor: $(this), trigger: $(this) });
		popupContainer.find("i:not(.selected)").click(function () {
			root.sortModel.direction($(this).attr("data-direction"));
			root.sortModel.comparer($(this).parent().attr("data-comparer"));
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}

	function _showTextFilter() {
		var popupContainer = IssueTracker.Popup.load({ view: "#text-filter-dialog", model: root.filter, anchor: $(this), trigger: $(this) });
		popupContainer.find("input").focus();
		popupContainer.find("button.clear-filter").click(function () {
			root.filter("");
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
		popupContainer.find("button.set-filter").click(function () {
			root.filter(popupContainer.find("input").val());
			IssueTracker.Popup.hide();
			_resetIssueList();
		});
	}
	
	function _setupLoadingMoreIssues() {
		$(window).scroll(function () {
			if ($(window).scrollTop() + $(window).height() > $(document).height() - 200)
				_getNextIssues(_issueCountToLoad);
		});
	}
	
	function _getNextIssues(count) {
		if (_nextIssuesRunning === true || _allLoaded === true)
			return;

		_loader.show();
		_nextIssuesRunning = true;
		$.get(IssueTracker.virtualDirectory() + "Issues/Next", _buildParameters(count)).done(function (issues) {
			root.list.pushAll(issues);
			if (issues.length < count)
				_allLoaded = true;
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).always(function() {
			_nextIssuesRunning = false;
			_loader.hide();
		});
		_start += count;
	}
	
	function _buildParameters(count) {
		return $.toDictionary({
			start: _start + 1,
			end: _start + count,
			project: IssueTracker.selectedProject(),
			priority: root.selectedPriority(),
			status: root.selectedStatus(),
			developer: root.selectedDeveloper(),
			direction: root.sortModel.direction(),
			comparer: root.sortModel.comparer(),
			filter: root.filter()
		});
	}
	
	function _resetIssueList() {
		_start = 0;
		_allLoaded = false;
		root.list([]);
		_getNextIssues(_startCount);
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues",
		title: "Issues",
		route: "#/:project-name/issues",
		style: "issues-container"
	});

})(root("IssueTracker.Issues"));
