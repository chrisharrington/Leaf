
(function(root) {

	var _container;
	var _observable;
	var _flipper;
	var _onSortSet;

	root.property = ko.observable("priority");
	root.direction = ko.observable("descending");

	root.init = function (container, flipper, observable, onSortSet) {
		_container = container;
		_observable = observable;
		_flipper = flipper;
		_onSortSet = onSortSet;

		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "#modify-sort", function () { _observable("modify-sort-template"); _flipper.toggle(); });
		_container.on("click", "div.modify-sort>div>i", _setSortProperties);
	}

	function _setSortProperties() {
		root.property($(this).closest("[data-property]").attr("data-property"));
		root.direction($(this).hasClass("fa-angle-down") ? "descending" : "ascending");
		_flipper.toggle();
		_onSortSet();
	}

})(root("IssueTracker.Issues.Sorter"));