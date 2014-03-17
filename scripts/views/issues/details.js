
(function(root) {

	var _container;

	root.selectedIssue = ko.observable(_buildDefaultIssue());

	root.init = function (container) {
		_container = container;
		
		_hookupEvents();
	};

	function _hookupEvents() {
		_container
			.on("mouseenter", "div.issues-container>div>a", function() { root.selectedIssue(_buildData($(this))); })
			.on("mouseleave", "div.issues-container>div>a", function() { root.selectedIssue(_buildDefaultIssue()); });
	}

	function _buildData(element) {
		return IssueTracker.Utilities.createPropertyObservables($.parseJSON($(element).attr("data-issue")));
	}

	function _buildDefaultIssue() {
		return {
			description: ko.observable(""),
			milestone: ko.observable(""),
			priority: ko.observable(""),
			status: ko.observable(""),
			type: ko.observable(""),
			developer: ko.observable(""),
			tester: ko.observable("")
		};
	}

})(root("IssueTracker.Issues.Details"));