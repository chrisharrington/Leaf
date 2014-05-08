
(function (root) {

	var _container;
	var _filter;
	var _sort;
	var _view;
	var _details;
	var _flipper;

	var _startCount = 50;
	var _issueCountToLoad = 15;
	var _start = 0;
	var _nextIssuesRunning = false;
	var _allLoaded = false;
	
	root.loading = ko.observable(true);

	root.list = ko.observableArray();
	root.sidebar = ko.observable();

	root.init = function (container) {
		_filter = IssueTracker.Issues.Filter;
		_sort = IssueTracker.Issues.Sort;
		_view = IssueTracker.Issues.View;
		_details = IssueTracker.Issues.Details;
		
		_container = container;
		_setupLoadingMoreIssues();

		_flipper = new IssueTracker.Controls.Flipper("div.sidebar .flipper");
		_filter.init(container, _flipper, root.sidebar, _resetIssueList);
		_sort.init(container, _flipper, root.sidebar, _resetIssueList);
		_view.init(container, _flipper, root.sidebar);
		_details.init(container);
	};

	root.load = function () {
		_resetIssueList();
		//$(window).on("focus", _resetIssueList);
	};

	root.unload = function () {
		$(window).off("focus", _resetIssueList);
	};

	root.reset = function () {
		_resetIssueList();
	};
	
	function _setupLoadingMoreIssues() {
		$(window).scroll(function () {
			if ($(window).scrollTop() + $(window).height() > $(document).height() - 200)
				_getNextIssues(_issueCountToLoad);
		});
	}
	
	function _getNextIssues(count) {
		if (_nextIssuesRunning === true || _allLoaded === true)
			return;

		_nextIssuesRunning = true;
		$.ajax({
			url: IssueTracker.virtualDirectory + "issues/list",
			data: _buildParameters(count),
			global: false
		}).done(function (issues) {
			if (_start == 0)
				root.list([]);
			root.list.pushAll(issues);
			if (issues.length < count)
				_allLoaded = true;
			_start += count;
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).always(function() {
			_nextIssuesRunning = false;
			root.loading(false);
		});
	}
	
	function _buildParameters(count) {
		return {
			start: _start + 1,
			end: _start + count,
			direction: _sort.direction(),
			comparer: _sort.property(),
			filter: "",
			milestones: _joinFilterIds(_filter.selectedMilestones(), IssueTracker.milestones()),
			priorities: _joinFilterIds(_filter.selectedPriorities(), IssueTracker.priorities()),
			statuses: _joinFilterIds(_filter.selectedStatuses(), IssueTracker.statuses()),
			types: _joinFilterIds(_filter.selectedTypes(), IssueTracker.issueTypes()),
			developers: _joinFilterIds(_filter.selectedDevelopers(), IssueTracker.users()),
			testers: _joinFilterIds(_filter.selectedTesters(), IssueTracker.users())
		};
	}
	
	function _joinFilterIds(filterCollection, masterCollection) {
		var ids = [];
		var collection = filterCollection.length == 0 ? masterCollection : filterCollection; 
		$.each(collection, function(i, filterItem) {
			ids.push(filterItem.id);
		});
		return ids.join(",");
	}

	function _resetIssueList() {
		_start = 0;
		_allLoaded = false;
		_getNextIssues(_startCount);
	}

	$(function() {
		IssueTracker.Page.build({
			root: IssueTracker.Issues,
			view: "issues",
			title: "Leaf - Issues",
			route: "#/issues",
			style: "issues-container"
		});
	});

})(root("IssueTracker.Issues"));
