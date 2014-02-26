
(function(root) {

	var _container;
	var _flipper;
	var _onFilterSet;

	root.selectedMilestones = ko.observableArray();
	root.selectedPriorities = ko.observableArray();
	root.selectedStatuses = ko.observableArray();
	root.selectedDevelopers = ko.observableArray();
	root.selectedTesters = ko.observableArray();

	root.init = function (container, onFilterSet) {
		_container = container;
		_onFilterSet = onFilterSet;
		_flipper = new IssueTracker.Controls.Flipper(container.find("div.sidebar .flipper"));

		_hookupEvents();

		container.find("#milestones-filter>div.selected").each(function () { root.selectedMilestones.push($(this).attr("data-id")); });
		container.find("#priority-filter>div.selected").each(function () { root.selectedPriorities.push($(this).attr("data-id")); });
		container.find("#status-filter>div.selected").each(function () { root.selectedStatuses.push($(this).attr("data-id")); });
		container.find("#developer-filter>div.selected").each(function () { root.selectedDevelopers.push($(this).attr("data-id")); });
		container.find("#tester-filter>div.selected").each(function () { root.selectedTesters.push($(this).attr("data-id")); });
	};

	function _hookupEvents() {
		_container.on("click", "#modify-filter", function () { _flipper.toggle(); });
		_container.on("click", "#set-filter", _saveFilter);
		_container.on("click", "#milestone-filter>div", function () { _toggleFilterItem($(this), root.selectedMilestones); });
		_container.on("click", "#priority-filter>div", function () { _toggleFilterItem($(this), root.selectedPriorities); });
		_container.on("click", "#status-filter>div", function () { _toggleFilterItem($(this), root.selectedStatuses); });
		_container.on("click", "#developer-filter>div", function () { _toggleFilterItem($(this), root.selectedDevelopers); });
		_container.on("click", "#tester-filter>div", function () { _toggleFilterItem($(this), root.selectedTesters); });
	}

	function _saveFilter() {
		_flipper.toggle();
		_onFilterSet();
	}

	function _toggleFilterItem(element, collection) {
		if (element.parent().find(">.selected").length == 1 && element.hasClass("selected"))
			return;
		element.toggleClass("selected");
		if (element.hasClass("selected"))
			collection.push(element.attr("data-id"));
		else
			collection.remove(element.attr("data-id"));
	}

})(root("IssueTracker.Issues.Filter"));