
(function(root) {

	var _container;
	var _observable;
	var _flipper;

	root.property = ko.observable("priority");
	root.direction = ko.observable("desc");

	root.init = function (container, flipper, observable) {
		_container = container;
		_observable = observable;
		_flipper = flipper;

		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "#modify-sort", function () { _observable("modify-sort-template"); _flipper.toggle(); });
		_container.on("click", "div.modify-sort>div>i", _setSortProperties);
	}

	function _setSortProperties() {
		root.property($(this).closest("[data-property]").attr("data-property"));
		root.direction($(this).hasClass("fa-angle-down") ? "desc" : "asc");
	}

})(root("IssueTracker.Issues.Sorter"));