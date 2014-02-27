
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

	root.isSelected = function() {
		var blah = this;
		debugger;
	};

	function _hookupEvents() {
		_container.on("click", "#modify-sort", function() { _observable("modify-sort-template"); _flipper.toggle(); });
	}

})(root("IssueTracker.Issues.Sorter"));