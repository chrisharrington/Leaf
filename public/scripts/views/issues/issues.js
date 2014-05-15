
(function (root) {

	var _container;
	var _filter;

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

		_container = container;
		_setupLoadingMoreIssues();

		_filter.init(container, root.sidebar, _resetIssueList);
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

		var date = new Date();
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
			console.log("Issue retrieval: " + (new Date() - date) + "ms");
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).always(function() {
			_nextIssuesRunning = false;
			root.loading(false);
		});
	}
	
	function _buildParameters(count) {
		var blah = _joinFilterIds(_filter.selectedDevelopers(), IssueTracker.users());
		var selectedLength = _filter.selectedDevelopers().length;
		var undeletedLength = _undeletedLength(IssueTracker.users());
		return {
			start: _start + 1,
			end: _start + count,
			direction: "descending",
			comparer: "priority",
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
		if (filterCollection.length == _undeletedLength(masterCollection))
			return "";

		var collection = filterCollection.length == 0 ? masterCollection : filterCollection; 
		$.each(collection, function(i, filterItem) {
			if (filterItem.id) {
				var type = typeof(filterItem.id);
				ids.push(typeof(filterItem.id) == "function" ? filterItem.id() : filterItem.id);
			}
		});
		return ids.join(",");
	}

	function _undeletedLength(collection) {
		var count = 0;
		for (var i = 0; i < collection.length; i++)
			if (collection[i].isDeleted == undefined || collection[i].isDeleted === false || (typeof(collection[i].isDeleted) == "function" && collection[i].isDeleted() === false))
				count++;
		return count;
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
