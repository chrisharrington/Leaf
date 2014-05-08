
(function(root) {

	var _container;
	var _isAdd;

	root.loading = ko.observable(false);
	root.text = ko.observable("");
	root.list = ko.observableArray();

	root.init = function(container, comments) {
		_container = container;

		_hookupEvents();
	};

	root.load = function (comments) {
		_isAdd = false;
		root.list.removeAll();
		root.list.pushAll(comments);
	};

	root.save = function() {
		return _save();
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

	function _hookupEvents() {
		_container.on("click", "#add-comment", _add);
	}

	function _removeConfirmed(comment) {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "issues/delete-comment", { comment: comment }).done(function() {
			IssueTracker.Dialog.hide();
			root.list.remove(function(c) { return c.id == comment.id; });
			IssueTracker.Feedback.success("The comment has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while removing your comment. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	function _add() {
		if (root.text() == "") {
			IssueTracker.Feedback.error("The comment text is required.");
			return;
		}

		_save();
	}

	function _save() {
		if (root.text() == "")
			return new ResolvedDeferred();

		root.loading(true);
		return $.post(IssueTracker.virtualDirectory + "issues/add-comment", { text: root.text(), issueId: IssueTracker.selectedIssue.id() }).done(function (saved) {
			_isAdd = true;
			var user = IssueTracker.signedInUser();
			root.list.splice(0, 0, saved);
			root.text("");
			IssueTracker.Notifications.refresh();
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while adding your comment. Please try again later.");
		}).always(function () {
			root.loading(false);
		});
	}

})(root("IssueTracker.IssueDetails.Comments"));