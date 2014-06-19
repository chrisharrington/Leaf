(function(root) {

	root.text = ko.observable("");
	root.loading = ko.observable(false);

	root.show = function() {
		IssueTracker.Dialog.load("add-comment-template", root).find("textarea").focus();
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	root.confirm = function() {
		if (_validate()) {
			root.loading(true);
			$.post(IssueTracker.virtualDirectory + "issues/add-comment", { issueId: IssueTracker.selectedIssue.id(), text: root.text() }).done(function (saved) {
				IssueTracker.Feedback.success("Your comment has been added.");
				IssueTracker.Dialog.hide();
				IssueTracker.IssueDetails.Comments.add(saved);
			}).fail(function () {
				IssueTracker.Feedback.error("An error has occurred while adding your comment. Please try again later.");
			}).always(function () {
				root.loading(false);
			});
		}
	};

	function _validate() {
		if (root.text() == "") {
			IssueTracker.Feedback.error("The text is required.");
			return false;
		}

		return true;
	}

})(root("IssueTracker.IssueDetails.AddComment"));