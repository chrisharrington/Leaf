IssueTracker.app.factory("issueFilter", function($rootScope) {
	var SET_FILTER_TIMEOUT_DURATION = 1000;

	var _milestonesStorageKey = "Filter.SelectedMilestones";
	var _prioritiesStorageKey = "Filter.SelectedPriorities";
	var _statusesStorageKey = "Filter.SelectedStatuses";
	var _typesStorageKey = "Filter.SelectedTypes";
	var _developersStorageKey = "Filter.SelectedDevelopers";
	var _testersStorageKey = "Filter.SelectedTesters";

	var _onFilterSet;
	var _filterSetTimeout;

	return new function() {
		this.selectedMilestones = [];
		this.selectedPriorities = [];
		this.selectedStatuses = [];
		this.selectedTypes = [];
		this.selectedDevelopers = [];
		this.selectedTesters = [];

		this.init = function (onFilterSet) {
			_onFilterSet = onFilterSet;

			_initializeData(this);
			_load(this);
		};

		this.contains = function (collection, data) {
			for (var i = 0; i < collection.length; i++) {
				var id = typeof(data.id) == "function" ? data.id() : data.id;
				var collectionId = typeof(collection[i].id) == "function" ? collection[i].id() : collection[i].id;
				if (collectionId === id)
					return true;
			}
			return false;
		};

		this.toggle = function (collection, data) {
			if (this.contains(collection, data)) {
				collection.remove(function (item) {
					return item.id === data.id;
				});
			} else {
				collection.push(data);
			}

			if (_filterSetTimeout)
				clearTimeout(_filterSetTimeout);

			_filterSetTimeout = setTimeout(function () {
				if (_onFilterSet)
					_onFilterSet();
			}, SET_FILTER_TIMEOUT_DURATION);

			_save(this);
		};
	};

	function _initializeData(scope) {
		scope.selectedMilestones.pushAll($rootScope.milestones);
		scope.selectedPriorities.pushAll($rootScope.priorities);
		scope.selectedStatuses.pushAll($rootScope.statuses);
		scope.selectedDevelopers.pushAll(_getUndeletedObjects($rootScope.users));
		scope.selectedTesters.pushAll(_getUndeletedObjects($rootScope.users));
		scope.selectedTypes.pushAll($rootScope.issueTypes);
	}

	function _getUndeletedObjects(collection) {
		var undeleted = [];
		for (var i = 0; i < collection.length; i++)
			if (collection[i].isDeleted === false)
				undeleted.push(collection[i]);
		return undeleted;
	}

	function _load(scope) {
		_restoreCommaSeparatedListTo(scope.selectedMilestones, _milestonesStorageKey);
		_restoreCommaSeparatedListTo(scope.selectedPriorities, _prioritiesStorageKey);
		_restoreCommaSeparatedListTo(scope.selectedStatuses, _statusesStorageKey);
		_restoreCommaSeparatedListTo(scope.selectedTypes, _typesStorageKey);
		_restoreCommaSeparatedListTo(scope.selectedDevelopers, _developersStorageKey);
		_restoreCommaSeparatedListTo(scope.selectedTesters, _testersStorageKey);
	}

	function _restoreCommaSeparatedListTo(collection, key) {
		var data = JSON.parse(window.localStorage.getItem(key));
		if (data) {
			collection.length = 0;
			collection.pushAll(data);
		}
	}

	function _save(scope) {
		_store(_milestonesStorageKey, scope.selectedMilestones);
		_store(_prioritiesStorageKey, scope.selectedPriorities);
		_store(_statusesStorageKey, scope.selectedStatuses);
		_store(_typesStorageKey, scope.selectedTypes);
		_store(_developersStorageKey, scope.selectedDevelopers);
		_store(_testersStorageKey, scope.selectedTesters);
	}

	function _store(key, data) {
		window.localStorage.setItem(key, JSON.stringify(data));
	}
});

(function(root) {



})(root("IssueTracker.Issues.Filter"));