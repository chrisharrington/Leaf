
(function(root) {

	var SET_FILTER_TIMEOUT_DURATION = 1000;

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
	var _template;
	var _filterSetTimeout;

	root.selectedMilestones = ko.observableArray();
	root.selectedPriorities = ko.observableArray();
	root.selectedStatuses = ko.observableArray();
	root.selectedTypes = ko.observableArray();
	root.selectedDevelopers = ko.observableArray();
	root.selectedTesters = ko.observableArray();

	root.init = function (container, flipper, template, onFilterSet) {
		_container = container;
		_onFilterSet = onFilterSet;
		_flipper = flipper;
		_template = template;
		_selected = {};

        _initializeData();
		_hookupEvents();

		_load();
	};

	root.contains = function(collection, data) {
		for (var i = 0; i < collection().length; i++)
			if (collection()[i].id === data.id)
				return true;
		return false;
	};

	root.toggle = function (collection, data, element) {
        if ($(element).hasClass("selected"))
		    collection.remove(function (item) { return item.id == data.id; });
        else
            collection.push(data);

		if (_filterSetTimeout)
			clearTimeout(_filterSetTimeout);

		_filterSetTimeout = setTimeout(function() {
			_onFilterSet();
			console.log("filter set");
		}, SET_FILTER_TIMEOUT_DURATION);

		_save();
	};

	function _hookupEvents() {
		_container.on("click", "#modify-filter", function () {
			_template("modify-filter-template");
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

    function _initializeData(data) {
        root.selectedMilestones.pushAll(IssueTracker.milestones());
        root.selectedPriorities.pushAll(IssueTracker.priorities());
        root.selectedStatuses.pushAll(IssueTracker.statuses());
        root.selectedDevelopers.pushAll(IssueTracker.users());
        root.selectedTesters.pushAll(IssueTracker.users());
        root.selectedTypes.pushAll(IssueTracker.issueTypes());
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
		if (data) {
            collection.removeAll();
			collection.pushAll(data);
        }
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