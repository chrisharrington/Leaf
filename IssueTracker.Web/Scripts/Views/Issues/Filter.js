
(function(root) {

	var _container;

	root.init = function (container) {
		_container = container;

		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "#set-filters", function() { IssueTracker.Dialog.load("#filter-dialog", root); });
	}

})(root("IssueTracker.Issues.Filter"));