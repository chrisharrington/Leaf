
(function(root) {

	var _milestonesStorageKey = "Filter.SelectedMilestones";
	var _prioritiesStorageKey = "Filter.SelectedPriorities";
	var _statusesStorageKey = "Filter.SelectedStatuses";
	var _typesStorageKey = "Filter.SelectedTypes";
	var _developersStorageKey = "Filter.SelectedDevelopers";
	var _testersStorageKey = "Filter.SelectedTesters";

	var _container;
	var _flipper;
	var _onFilterSet;
	var _selected;
	var _observable;

	root.selectedMilestones = ko.observableArray();
	root.selectedPriorities = ko.observableArray();
	root.selectedStatuses = ko.observableArray();
	root.selectedTypes = ko.observableArray();
	root.selectedDevelopers = ko.observableArray();
	root.selectedTesters = ko.observableArray();

	root.init = function (container, flipper, templateObservable, onFilterSet) {
		_container = container;
		_onFilterSet = onFilterSet;
		_flipper = flipper;
		_observable = templateObservable;
		_selected = {};

		_hookupEvents();

		_load();
	};

	root.contains = function(collection, data) {
		for (var i = 0; i < collection().length; i++)
			if (collection()[i].id === data.id)
				return true;
		return false;
	};

	root.remove = function (collection, data) {
		collection.remove(function (item) { return item.id == data.id; });
		_onFilterSet();
		_save();
	};

	function _hookupEvents() {
		_container.on("click", "#modify-filter", function () {
			_observable("modify-filter-template");
			_flipper.toggle();
		});
		_container.on("click", "#set-filter", _saveFilter);
		_container.on("click", "#milestone-filter>div", function () { _toggleFilterItem($(this), root.selectedMilestones); });
		_container.on("click", "#priority-filter>div", function () { _toggleFilterItem($(this), root.selectedPriorities); });
		_container.on("click", "#status-filter>div", function () { _toggleFilterItem($(this), root.selectedStatuses); });
		_container.on("click", "#type-filter>div", function() { _toggleFilterItem($(this), root.selectedTypes); });
		_container.on("click", "#developer-filter>div", function () { _toggleFilterItem($(this), root.selectedDevelopers); });
		_container.on("click", "#tester-filter>div", function () { _toggleFilterItem($(this), root.selectedTesters); });
	}

	function _saveFilter() {
		_flipper.toggle();
		_onFilterSet();
		_save();
	}

	function _toggleFilterItem(element, collection) {
		var raw = $.parseJSON(element.attr("data-raw"));
		if (!root.contains(collection, raw))
			collection.push(raw);
		else
			collection.remove(function(item) { return item.id == raw.id; });
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
		var data = $.jStorage.get(key);
		if (data)
			collection.pushAll(data);
	}

	function _save() {
		$.jStorage.set(_milestonesStorageKey, root.selectedMilestones());
		$.jStorage.set(_prioritiesStorageKey, root.selectedPriorities());
		$.jStorage.set(_statusesStorageKey, root.selectedStatuses());
		$.jStorage.set(_typesStorageKey, root.selectedTypes());
		$.jStorage.set(_developersStorageKey, root.selectedDevelopers());
		$.jStorage.set(_testersStorageKey, root.selectedTesters());
	}

})(root("IssueTracker.Issues.Filter"));