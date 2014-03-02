
(function(root) {

	var _container;

	root.loading = ko.observable(false);
	root.text = ko.observable("");

	root.init = function(container) {
		_container = container;

		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "#add-comment", _add);
	}

	function _add() {
		if (root.text() == "") {
			IssueTracker.Feedback.error("The comment text is required.");
			return;
		}

		root.loading(true);
		$.post(IssueTracker.virtualDirectory() + "Issues/AddComment", { text: root.text(), issueId: IssueTracker.selectedIssue.id() }).done(function() {
			// update comments array
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while adding your comment. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

})(root("IssueTracker.IssueDetails.Comments"));