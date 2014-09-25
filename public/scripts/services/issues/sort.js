IssueTracker.app.factory("issueSort", function() {
	var SORT_STORAGE_KEY = "Sort.SelectedSort", _onSortChanged;

	return new function() {
		this.selected = undefined;
		this.visible = false;
		this.options = [];

		this.init = function(onSortChanged) {
			_onSortChanged = onSortChanged;
			_buildSortOptions(this);
			_load(this);
		};

		this.toggle = function() {
			this.visible = !this.visible;
		};

		this.select = function(sort) {
			this.selected = sort;
			_onSortChanged(sort);
			_save(sort);
		};
	};

	function _buildSortOptions(scope) {
		scope.options.push(new Sort("highest priority", "Highest Priority", "priority", "descending"));
		scope.options.push(new Sort("recently opened", "Recently Opened", "opened", "descending"));
	}

	function _save(sort) {
		window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sort));
	}

	function _load(scope) {
		scope.selected = JSON.parse(window.localStorage.getItem(SORT_STORAGE_KEY)) || scope.options[0];
	}
});

function Sort(label, display, comparer, direction) {
	this.label = label;
	this.display = display;
	this.comparer = comparer;
	this.direction = direction;
}