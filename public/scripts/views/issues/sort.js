(function(root) {

	root.selected = ko.observable(new Sort());
	root.visible = ko.observable(false);
	root.options = ko.observableArray();

	root.init = function(sort) {
		_buildSortOptions();
		root.select(sort || root.options()[0]);
	};

	root.toggle = function() {
		root.visible(!root.visible());
	};

	root.select = function(sort) {
		root.selected(sort);
	};

	function _buildSortOptions() {
		root.options.push(new Sort("highest priority", "Highest Priority", "priority", "descending"));
		root.options.push(new Sort("recently opened", "Recently Opened", "opened", "descending"));
	}

})(root("IssueTracker.Issues.Sort"));

function Sort(label, display, comparer, direction) {
	this.label = label;
	this.display = display;
	this.comparer = comparer;
	this.direction = direction;
}