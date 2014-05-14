
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
        root.selectedDevelopers.pushAll(IssueTracker.users());
        root.selectedTesters.pushAll(IssueTracker.users());
        root.selectedTypes.pushAll(IssueTracker.issueTypes());
    }

	function _saveFilter() {
		_onFilterSet();
		_save();
	}

	function _load() {
		_restoreCommaSeparatedListTo(root.selectedMilestones, _milestonesStorageKey, true);
		_restoreCommaSeparatedListTo(root.selectedPriorities, _prioritiesStorageKey, true);
		_restoreCommaSeparatedListTo(root.selectedStatuses, _statusesStorageKey, true);
		_restoreCommaSeparatedListTo(root.selectedTypes, _typesStorageKey);
		_restoreCommaSeparatedListTo(root.selectedDevelopers, _developersStorageKey, true);
		_restoreCommaSeparatedListTo(root.selectedTesters, _testersStorageKey, true);
	}

	function _restoreCommaSeparatedListTo(collection, key, isObservable) {
		var data = $.jStorage.get(key);
		if (data) {
            collection.removeAll();
			if (isObservable) {
				for (var i = 0; i < data.length; i++)
					collection.push(IssueTracker.Utilities.createPropertyObservables(data[i]));
			} else
				collection.pushAll(data);
        }
	}

	function _save() {
		$.jStorage.set(_milestonesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedMilestones()));
		$.jStorage.set(_prioritiesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedPriorities()));
		$.jStorage.set(_statusesStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedStatuses()));
		$.jStorage.set(_typesStorageKey, root.selectedTypes());
		$.jStorage.set(_developersStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedDevelopers()));
		$.jStorage.set(_testersStorageKey, IssueTracker.Utilities.extractPropertyObservableValuesFromArray(root.selectedTesters()));
	}

})(root("IssueTracker.Issues.Filter"));