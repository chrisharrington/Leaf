
(function(root) {

	var SET_FILTER_TIMEOUT_DURATION = 1000;

	var _milestonesStorageKey = "Filter.SelectedMilestones";
	var _prioritiesStorageKey = "Filter.SelectedPriorities";
	var _statusesStorageKey = "Filter.SelectedStatuses";
	var _typesStorageKey = "Filter.SelectedTypes";
	var _developersStorageKey = "Filter.SelectedDevelopers";
	var _testersStorageKey = "Filter.SelectedTesters";

	var _onFilterSet;
	var _filterSetTimeout;

	root.selectedMilestones = ko.observableArray();
	root.selectedPriorities = ko.observableArray();
	root.selectedStatuses = ko.observableArray();
	root.selectedTypes = ko.observableArray();
	root.selectedDevelopers = ko.observableArray();
	root.selectedTesters = ko.observableArray();

	root.init = function (container, template, onFilterSet) {
		_onFilterSet = onFilterSet;

        _initializeData();
		_load();
	};

	root.contains = function(collection, data) {
		collection = collection();
		for (var i = 0; i < collection.length; i++) {
			var id = typeof(data.id) == "function" ? data.id() : data.id;
			var collectionId = typeof(collection[i].id) == "function" ? collection[i].id() : collection[i].id;
			if (collectionId === id)
				return true;
		}
		return false;
	};

	root.toggle = function (collection, data, element) {
        if ($(element).hasClass("selected")) {
			collection.remove(function (item) {
				var itemId = typeof(item.id) == "function" ? item.id() : item.id;
				var dataId = typeof(data.id) == "function" ? data.id() : data.id;
				return itemId == dataId;
			});
		} else {
			collection.push(data);
		}

		if (_filterSetTimeout)
			clearTimeout(_filterSetTimeout);

		_filterSetTimeout = setTimeout(function() {
			_onFilterSet();
		}, SET_FILTER_TIMEOUT_DURATION);

		_save();
	};

    function _initializeData(data) {
        root.selectedMilestones.pushAll(IssueTracker.milestones());
        root.selectedPriorities.pushAll(IssueTracker.priorities());
        root.selectedStatuses.pushAll(IssueTracker.statuses());
        root.selectedDevelopers.pushAll(_getUndeletedObjects(IssueTracker.users()));
        root.selectedTesters.pushAll(_getUndeletedObjects(IssueTracker.users()));
        root.selectedTypes.pushAll(IssueTracker.issueTypes());
    }

	function _getUndeletedObjects(collection) {
		var undeleted = [];
		for (var i = 0; i < collection.length; i++)
			if (collection[i].isDeleted() === false)
				undeleted.push(collection[i]);
		return undeleted;
	}

	function _saveFilter() {
		_onFilterSet();
		_save();
	}

	function _load() {
		_restoreCommaSeparatedListTo(root.selectedMilestones, _milestonesStorageKey);
		_restoreCommaSeparatedListTo(root.selectedPriorities, _prioritiesStorageKey);
		_restoreCommaSeparatedListTo(root.selectedStatuses, _statusesStorageKey);
		_restoreCommaSeparatedListTo(root.selectedTypes, _typesStorageKey);
		_restoreCommaSeparatedListTo(root.selectedDevelopers, _developersStorageKey);
		_restoreCommaSeparatedListTo(root.selectedTesters, _testersStorageKey);
	}

	function _restoreCommaSeparatedListTo(collection, key) {
		var data = amplify.store(key);
		if (data) {
            collection.removeAll();
			for (var i = 0; i < data.length; i++)
				collection.push(IssueTracker.Utilities.createPropertyObservables(data[i]));
        }
	}

	function _save() {
		amplify.store(_milestonesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedMilestones()));
		amplify.store(_prioritiesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedPriorities()));
		amplify.store(_statusesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedStatuses()));
		amplify.store(_typesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedTypes()));
		amplify.store(_developersStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedDevelopers()));
		amplify.store(_testersStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedTesters()));
	}

})(root("IssueTracker.Issues.Filter"));