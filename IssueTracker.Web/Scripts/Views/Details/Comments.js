
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

	root.slideDown = function (element) {
		if (_isAdd)
			$(element).hide().slideDown(200);
	};

	function _hookupEvents() {
		_container.on("click", "#add-comment", _add);
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
		return $.post(IssueTracker.virtualDirectory() + "Issues/AddComment", { text: root.text(), issueId: IssueTracker.selectedIssue.id() }).done(function () {
			_isAdd = true;
			root.list.push({ date: new Date().toApplicationString(), user: IssueTracker.signedInUser().name(), text: root.text() });
			root.text("");
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while adding your comment. Please try again later.");
		}).always(function () {
			root.loading(false);
		});
	}

})(root("IssueTracker.IssueDetails.Comments"));