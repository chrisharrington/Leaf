(function(root) {

	root.text = ko.observable("");

	root.search = function() {
		_getSearchResults(root.text()).done(function() {
			alert("done");
		});
	};

	function _getSearchResults(text) {
		return $.get(IssueTracker.virtualDirectory() + "search", { text: text }).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while performing your search. Please try again later.");
		});
	}

})(root("IssueTracker.Search"));