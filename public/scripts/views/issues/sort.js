(function(root) {

	var SORT_STORAGE_KEY = "Sort.SelectedSort";

	root.selected = ko.observable(new Sort());
	root.visible = ko.observable(false);
	root.options = ko.observableArray();

	root.init = function() {
		_buildSortOptions();
		_load();
		root.selected.subscribe(_save);
	};

	root.toggle = function() {
		root.visible(!root.visible());
	};

	root.select = function(sort) {
		root.selected(sort);
	};

	function _buildSortOptions() {
		root.options.push(new Sort("highest priority", "Highest Priority", "priority", "ascending"));
		root.options.push(new Sort("recently opened", "Recently Opened", "opened", "descending"));
	}

	function _save() {
		amplify.store(SORT_STORAGE_KEY, root.selected());
	}

	function _load() {
		root.selected(amplify.store(SORT_STORAGE_KEY) || root.options()[0]);
	}

})(root("IssueTracker.Issues.Sort"));

function Sort(label, display, comparer, direction) {
	this.label = label;
	this.display = display;
	this.comparer = comparer;
	this.direction = direction;
}