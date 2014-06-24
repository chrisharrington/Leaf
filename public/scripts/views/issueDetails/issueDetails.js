
(function (root) {

	var _container;
	var _oldName;
	var _detailsFlipper;
	var _updateNeeded;

	root.saving = ko.observable(false);
	root.comments = ko.observableArray();

	root.chooser = {
		template: ko.observable(),
		data: ko.observable()
	};

	root.init = function (container) {
		_container = container;

		root.Comments.init(container);
		root.Files.init(container.find("input[type='file']"));
	};

	root.load = function (container) {
		_detailsFlipper = new IssueTracker.Controls.Flipper("#choices-container");
		_oldName = IssueTracker.selectedIssue.description();
		root.Comments.load(IssueTracker.selectedIssue.history());
		root.Files.load(IssueTracker.selectedIssue.id(), IssueTracker.selectedIssue.files());

		_updateNeeded = false;
		IssueTracker.selectedIssue.statusId.subscribe(_updateRequired);
		IssueTracker.selectedIssue.description.subscribe(_updateRequired);
		IssueTracker.selectedIssue.details.subscribe(_updateRequired);
		IssueTracker.selectedIssue.milestoneId.subscribe(_updateRequired);
		IssueTracker.selectedIssue.priorityId.subscribe(_updateRequired);
		IssueTracker.selectedIssue.typeId.subscribe(_updateRequired);
		IssueTracker.selectedIssue.developerId.subscribe(_updateRequired);
		IssueTracker.selectedIssue.testerId.subscribe(_updateRequired);

		IssueTracker.selectedIssue.details.subscribe(function() { container.find("textarea").autogrow(); });
		container.find("textarea").autogrow();

		if (!IssueTracker.isAuthorized("edit-issue"))
			container.addClass("disabled");
	};

	root.selectDescription = function() {
		_container.find("#description").select();
	};

	root.selectDetails = function() {
		_container.find("#details").select();
	};

	root.update = function() {
		root.saving(true);
		_save().done(function () {
			IssueTracker.selectedIssue.closed(_issueIsClosed(IssueTracker.selectedIssue.statusId()) ? new Date().toShortDateString() : null);
			window.location.hash = window.location.hash.replace(_oldName.formatForUrl(), IssueTracker.selectedIssue.description().formatForUrl());
			IssueTracker.Feedback.success("Your issue has been updated.");
			IssueTracker.Notifications.refresh();
			_container.find("div.new-comment textarea").removeAttr("style");
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while saving your issue. Please try again later.");
		}).always(function () {
			root.saving(false);
		});
	};

	function _issueIsClosed(statusId) {
		var closed = false;
		$.each(IssueTracker.statuses(), function(i, status) {
			if (status.isClosedStatus && status.id == statusId)
				closed = true;
		});
		return closed;
	}

	function _save() {
		if (_updateNeeded)
			return $.post(IssueTracker.virtualDirectory + "issues/update", _buildIssueParameters())
		else
			return new ResolvedDeferred();
	}

	function _buildIssueParameters() {
		var issue = IssueTracker.selectedIssue;
		return {
			id: issue.id(),
			number: issue.number(),
			description: issue.description(),
			details: issue.details(),
			milestoneId: issue.milestoneId(),
			priorityId: issue.priorityId(),
			statusId: issue.statusId(),
			typeId: issue.typeId(),
			developerId: issue.developerId(),
			testerId: issue.testerId(),
			opened: issue.opened()
		};
	}

	function _updateRequired() {
		_updateNeeded = true;
	}

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: function () { return "issues/details?number=:number"; },
			title: function() { return "Leaf - " + IssueTracker.selectedIssue.number() + ": " + IssueTracker.selectedIssue.description(); },
			route: "#/issues/:number",
			style: "issue-details-container"
		});
	});

})(root("IssueTracker.IssueDetails"));
