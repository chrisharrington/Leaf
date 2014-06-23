
(function(root) {

	var _isAdd;

	root.loading = ko.observable(false);
	root.text = ko.observable("");
	root.comments = ko.observableArray();

	root.init = function(container) {
		root.comments.subscribe(function() {
			_setUserInfoWidths(container);
		});
	};

	root.load = function (comments) {
		_isAdd = false;
		root.comments.removeAll();
		root.comments.pushAll(comments);
	};

	root.add = function() {
		_isAdd = true;
		if (root.text() == "") {
			IssueTracker.Feedback.error("The comment text is required.");
			return;
		}

		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "issues/add-comment", { text: root.text(), issueId: IssueTracker.selectedIssue.id() }).done(function(saved) {
			IssueTracker.Feedback.success("Your comment has been added.");
			root.text("");
			root.comments.splice(0, 0, saved);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while saving your comment. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.remove = function(comment) {
		IssueTracker.Dialog.load("#confirm-delete-comment-template", {
			loading: root.loading,
			cancel: function() { IssueTracker.Dialog.hide(); },
			confirm: function() { _removeConfirmed(comment); }
		});
	};

	root.slideDown = function (element) {
		if (_isAdd)
			$(element).hide().slideDown(200);
	};

	root.isOwner = function(comment) {
		return comment.userId == IssueTracker.signedInUser().id();
	};

	function _removeConfirmed(comment) {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "issues/delete-comment", { comment: comment }).done(function() {
			IssueTracker.Dialog.hide();
			root.comments.remove(function(c) { return c.id == comment.id; });
			IssueTracker.Feedback.success("The comment has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while removing your comment. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	function _setUserInfoWidths(container) {
		if (root.comments().length == 0)
			return;

		container.find("div.info-container").each(function() {
			var width = $(this).find("div.user").width()+31;
			var text = $(this).parent().find("div.text-container");
			$(this).width(width).css("margin-right", (width*-1) + "px");
			text.css("padding-left", width + "px");
		});
	}

})(root("IssueTracker.IssueDetails.Comments"));