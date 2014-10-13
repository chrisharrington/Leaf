IssueTracker.app.controller("issues", function($scope, authentication, issues, once) {
	authentication.check();
	once("issues", function() { issues.init($scope); });
	issues.load($scope);
});

IssueTracker.app.factory("issues", function($rootScope, issueRepository, feedback, issueSort, issueFilter, $q, $timeout) {
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

			scope.first = true;
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
			_issues.pushAll(issues.map(function(issue, i) {
				issue.priorityColour = priorities[issue.priorityId].colour;
				issue.localIndex = i;
				return issue;
			}));
			scope.issues = _issues;

			_onDone().then(function() {
				scope.loading = false;
				scope.first = false;
                $rootScope.$broadcast("issuesLoaded", {
                    count: _issues.length
                });
			});
		}).catch(function() {
			feedback.error("An error has occurred while retrieving the issues list. Please try again later.");
		});
	}

	function _onDone() {
		return $q(function(resolve) {
			var count = 0, interval = setInterval(function() {
				if ($("div.data>a").length > 0) {
					clearInterval(interval);
					resolve();
				}
			}, 50);
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