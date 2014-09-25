IssueTracker.app.controller("issues", function($scope, authentication, issues, once) {
	authentication.check();
	once("issues", function() { issues.init($scope); });
	issues.load($scope);
});

IssueTracker.app.factory("issues", function($rootScope, issueRepository, feedback, issueSort, issueFilter) {
	var START_COUNT = 50;
	var PAGE_SIZE = 15;

	var _page, _done, _issues;

	return {
		init: function(scope) {
			_issues = [];
			_setupLoadingMoreIssues(scope);
		},

		load: function(scope) {
			_page = 1;
			_done = false;

			scope.sort = issueSort;
			scope.filter = issueFilter;
			scope.loading = false;
			scope.issues = _issues;

			scope.sort.init(function() { _resetIssues(scope); });
			scope.filter.init(function() { _resetIssues(scope); });
			_getIssues(scope);
		}
	};

	function _setupLoadingMoreIssues(scope) {
		$(window).scroll(function () {
			if (!scope.loading && !_done && $(window).scrollTop() + $(window).height() > $(document).height() - 200) {
				_page++;
				_getIssues(scope);
			}
		});
	}

	function _getIssues(scope) {
		var start = _page === 1 ? 1 : (START_COUNT+(PAGE_SIZE*(_page-2))+1), end = _page === 1 ? START_COUNT : (START_COUNT+(PAGE_SIZE*(_page-1)));
		scope.loading = true;
		issueRepository.search(_buildParameters(scope, start, end)).then(function(issues) {
			if (issues.length < PAGE_SIZE)
				_done = true;
			var priorities = $rootScope.priorities.dict("id");
			_issues.pushAll(issues.map(function(issue) {
				issue.priorityColour = priorities[issue.priorityId].colour;
				return issue;
			}));

			scope.issues = _issues;
		}).catch(function() {
			feedback.error("An error has occurred while retrieving the issues list. Please try again later.");
		}).finally(function() {
			scope.loading = false;
		});
	}

	function _resetIssues(scope) {
		_done = false;
		_page = 1;
		_issues = [];
		_getIssues(scope);
	}

	function _buildParameters(scope, start, end) {
		return {
			isDeleted: false,
			start: start,
			end: end,
			direction: scope.sort.selected.direction,
			comparer: scope.sort.selected.comparer,
			filter: "",
			milestones: _joinFilterIds(scope.filter.selectedMilestones, $rootScope.milestones),
			priorities: _joinFilterIds(scope.filter.selectedPriorities, $rootScope.priorities),
			statuses: _joinFilterIds(scope.filter.selectedStatuses, $rootScope.statuses),
			types: _joinFilterIds(scope.filter.selectedTypes, $rootScope.issueTypes),
			developers: _joinFilterIds(scope.filter.selectedDevelopers, $rootScope.users),
			testers: _joinFilterIds(scope.filter.selectedTesters, $rootScope.users)
		};
	}

	function _joinFilterIds(filterCollection, masterCollection) {
		var ids = [];
		if (filterCollection.length === masterCollection.where(function(o) { return !o.isDeleted; }))
			return "";

		var collection = filterCollection.length === 0 ? masterCollection : filterCollection;
		$.each(collection, function(i, filterItem) {
			if (filterItem.id)
				ids.push(filterItem.id);
		});
		return ids.join(",");
	}
});

//(function (root) {
//
//	var _container;
//	var _filter = IssueTracker.Issues.Filter;
//
//	var _startCount = 50;
//	var _issueCountToLoad = 15;
//	var _start = 0;
//	var _nextIssuesRunning = false;
//	var _allLoaded = false;
//
//	root.loading = ko.observable(true);
//
//	root.list = ko.observableArray();
//	root.sidebar = ko.observable();
//
//	root.init = function (container) {
//		_container = container;
//		_setupLoadingMoreIssues();
//
//		_filter.init(container, root.sidebar, _resetIssueList);
//		root.Sort.init();
//
//		//$(window).on("focus", _resetIssueList);
//
//		root.Sort.selected.subscribe(function() {
//			if (root.Sort.selected().direction)
//				_resetIssueList();
//		});
//	};
//
//	root.load = function () {
//		_resetIssueList();
//	};
//
//	root.unload = function () {
//		$(window).off("focus", _resetIssueList);
//	};
//
//	root.reset = function () {
//		_resetIssueList();
//	};
//
//	function _setupLoadingMoreIssues() {
//		$(window).scroll(function () {
//			if ($(window).scrollTop() + $(window).height() > $(document).height() - 200)
//				_getNextIssues(_issueCountToLoad);
//		});
//	}
//
//	function _getNextIssues(count) {
//		if (_nextIssuesRunning === true || _allLoaded === true)
//			return;
//
//		_nextIssuesRunning = true;
//		$.ajax({
//			url: IssueTracker.virtualDirectory + "issues/list",
//			data: _buildParameters(count),
//			global: false
//		}).done(function (issues) {
//			if (_start == 0)
//				root.list([]);
//			root.list.pushAll(issues);
//			if (issues.length < count)
//				_allLoaded = true;
//			_start += count;
//		}).fail(function () {
//			IssueTracker.Feedback.error("An error has occurred while retrieving the next set of issues. Please try again later.");
//		}).always(function() {
//			_nextIssuesRunning = false;
//			root.loading(false);
//		});
//	}
//
//	function _buildParameters(count) {
//		var selectedLength = _filter.selectedDevelopers().length;
//		var undeletedLength = _undeletedLength(IssueTracker.users());
//		return {
//			start: _start + 1,
//			end: _start + count,
//			direction: root.Sort.selected().direction,
//			comparer: root.Sort.selected().comparer,
//			filter: "",
//			milestones: _joinFilterIds(_filter.selectedMilestones(), IssueTracker.milestones()),
//			priorities: _joinFilterIds(_filter.selectedPriorities(), IssueTracker.priorities()),
//			statuses: _joinFilterIds(_filter.selectedStatuses(), IssueTracker.statuses()),
//			types: _joinFilterIds(_filter.selectedTypes(), IssueTracker.issueTypes()),
//			developers: _joinFilterIds(_filter.selectedDevelopers(), IssueTracker.users()),
//			testers: _joinFilterIds(_filter.selectedTesters(), IssueTracker.users())
//		};
//	}
//
//	function _joinFilterIds(filterCollection, masterCollection) {
//		var ids = [];
//		if (filterCollection.length == _undeletedLength(masterCollection))
//			return "";
//
//		var collection = filterCollection.length == 0 ? masterCollection : filterCollection;
//		$.each(collection, function(i, filterItem) {
//			if (filterItem.id) {
//				var type = typeof(filterItem.id);
//				ids.push(typeof(filterItem.id) == "function" ? filterItem.id() : filterItem.id);
//			}
//		});
//		return ids.join(",");
//	}
//
//	function _undeletedLength(collection) {
//		var count = 0;
//		for (var i = 0; i < collection.length; i++)
//			if (collection[i].isDeleted == undefined || collection[i].isDeleted === false || (typeof(collection[i].isDeleted) == "function" && collection[i].isDeleted() === false))
//				count++;
//		return count;
//	}
//
//	function _resetIssueList() {
//		_start = 0;
//		_allLoaded = false;
//		_getNextIssues(_startCount);
//	}
//
//	$(function() {
//		IssueTracker.Page.build({
//			root: IssueTracker.Issues,
//			view: "issues",
//			title: "Leaf - Issues",
//			route: "#/issues",
//			style: "issues-container"
//		});
//	});
//
//})(root("IssueTracker.Issues"));
