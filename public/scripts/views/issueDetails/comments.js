
(function(root) {

	root.loading = ko.observable(false);
	root.text = ko.observable("");
	root.comments = ko.observableArray();

	root.init = function(container) {
		root.comments.subscribe(function() {
			_setUserInfoWidths(container);
		});
	};

	root.load = function (comments) {
		root.comments.removeAll();
		root.comments.pushAll(comments);
	};

	root.add = function(comment) {
		root.comments.splice(0, 0, comment);
	};

	root.remove = function(comment) {
		IssueTracker.Dialog.load("#confirm-delete-comment-template", {
			loading: root.loading,
			cancel: function() { IssueTracker.Dialog.hide(); },
			confirm: function() { _removeConfirmed(comment); }
		});
	};

	root.slideDown = function (element) {
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
			var width = $(this).find("div.user").width()+30;
			$(this).width(width).css("margin-right", (width*-1) + "px");
			$(this).parent().find("div.text-container").css("padding-left", width + "px");
		});
	}

})(root("IssueTracker.IssueDetails.Comments"));