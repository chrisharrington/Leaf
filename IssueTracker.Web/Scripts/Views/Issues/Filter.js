
(function(root) {

	var _container;
	var _flipper;

	root.init = function (container) {
		_container = container;
		_flipper = new IssueTracker.Controls.Flipper(container.find("div.sidebar .flipper"));

		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "#modify-filter", function () { _flipper.toggle(); });
		_container.on("click", "#set-filter", _saveFilter);
	}

	function _saveFilter() {
		_flipper.toggle();
	}

})(root("IssueTracker.Issues.Filter"));