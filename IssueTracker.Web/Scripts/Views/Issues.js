
(function (root) {

	var _container;
	var _startCount = 50;
	var _issueCountToLoad = 15;
	var _start = 0;
	var _nextIssuesRunning = false;
	var _allLoaded = false;
	var _filter;
	var _loader;

	root.list = ko.observableArray();
	
	root.filter = ko.observable("");
	root.selectedPriority = ko.observable();
	root.selectedStatus = ko.observable();
	root.selectedAssignee = ko.observable();
	root.selectedOwner = ko.observable();

	root.sortModel = {
		direction: ko.observable("descending"),
		comparer: ko.observable("priority")
	};

	root.load = function (container) {
		_container = container;

		_loader = container.find("table tfoot");
		_setupFilter(container);
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
		root.selectedAssignee(undefined);
		root.selectedOwner(undefined);
		root.filter("");

		_loadFilters();
	}

	function _loadFilters() {
		var loading = _container.find("div.filter-tags div.loading").removeClass("hidden");
		var filters = _container.find("div.filter-tags div.filters").addClass("hidden");

		$.get(IssueTracker.virtualDirectory() + "Root/Filters", $.toDictionary({ project: IssueTracker.selectedProject() })).success(function(data) {
			IssueTracker.priorities(data.priorities);
			IssueTracker.statuses(data.statuses);
			IssueTracker.users(data.users);
		}).error(function() {
			alert("An error has occurred while retrieving your project's filter data. Please try again later.");
		}).complete(function() {
			loading.addClass("hidden");
			filters.removeClass("hidden");
		});
	}

	function _hookupEvents(container) {
		container.on("click", "table tbody tr", function() {
			var issue = $.parseJSON($(this).attr("data-issue"));
			IssueTracker.selectedIssue(issue);
			IssueTracker.IssueDetails.navigate({ name: issue.name.formatForUrl() });
		});

		container.find("#priority-filter").click(function() {
			var popupContainer = IssueTracker.Popup.load({ view: "#priority-filter-dialog", anchor: $(this).find(">span"), trigger: $(this) });
			popupContainer.find(">div").click(function () {
				root.selectedPriority($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-priority")));
				$(this).toggleClass("selected");
				IssueTracker.Popup.hide();
				_resetIssueList();
			});
		});
		
		container.find("#status-filter").click(function () {
			var popupContainer = IssueTracker.Popup.load({ view: "#status-filter-dialog", anchor: $(this).find(">span"), trigger: $(this) });
			popupContainer.find(">div").click(function () {
				root.selectedStatus($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-status")));
				$(this).toggleClass("selected");
				IssueTracker.Popup.hide();
				_resetIssueList();
			});
		});

		container.find("#assignee-filter").click(function () {
			var popupContainer = IssueTracker.Popup.load({ view: "#assignee-filter-dialog", anchor: $(this).find(">span"), trigger: $(this) });
			popupContainer.find(">div").click(function () {
				root.selectedAssignee($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-assignee")));
				$(this).toggleClass("selected");
				IssueTracker.Popup.hide();
				_resetIssueList();
			});
		});

		container.find("#owner-filter").click(function () {
			var popupContainer = IssueTracker.Popup.load({ view: "#owner-filter-dialog", anchor: $(this).find(">span"), trigger: $(this) });
			popupContainer.find(">div").click(function () {
				root.selectedOwner($(this).hasClass("selected") ? undefined : $.parseJSON($(this).attr("data-owner")));
				$(this).toggleClass("selected");
				IssueTracker.Popup.hide();
				_resetIssueList();
			});
		});

		container.find("#sort").click(function() {
			var popupContainer = IssueTracker.Popup.load({ view: "#sort-dialog", model: root.sortModel, anchor: $(this), trigger: $(this) });
			popupContainer.find("i:not(.selected)").click(function() {
				root.sortModel.direction($(this).attr("data-direction"));
				root.sortModel.comparer($(this).parent().attr("data-comparer"));
				IssueTracker.Popup.hide();
				_resetIssueList();
			});
		});

		container.find("#text-filter").click(function() {
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
		});
	}

	function _setupFilter(container) {
		_filter = container.find("div.filter");
		_filter.on("focus", "input[type='text']", function() { _filter.addClass("focus"); });
		_filter.on("blur", "input[type='text']", function () { _filter.removeClass("focus"); });
		_filter.on("click", "i", function () { _filter.find("input[type='text']").val("").keyup(); });
		_filter.click(function () { $(this).find("input").focus(); });
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
		$.get(IssueTracker.virtualDirectory() + "Issues/Next", _buildParameters(count)).success(function(issues) {
			root.list.pushAll(issues);
			if (issues.length < count)
				_allLoaded = true;
		}).error(function() {
			alert("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).complete(function() {
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
			assignee: root.selectedAssignee(),
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
		route: "#/issues",
		style: "issues-container"
	});

})(root("IssueTracker.Issues"));
