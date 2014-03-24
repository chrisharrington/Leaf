
(function(root) {

	var _container;

	root.selectedIssue = ko.observable();

	root.init = function (container) {
		_container = container;
		
		_hookupEvents();
	};

	function _hookupEvents() {
		_container
			.on("mouseenter", "div.issues-list>div>a", function() { root.selectedIssue(_buildData($(this))); })
			.on("mouseleave", "div.issues-list>div>a", function() { root.selectedIssue(undefined); });
	}

	function _buildData(element) {
		return IssueTracker.Utilities.createPropertyObservables($.parseJSON($(element).attr("data-issue")));
	}

})(root("IssueTracker.Issues.Details"));