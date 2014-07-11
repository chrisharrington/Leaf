
(function(root) {

	root.loading = ko.observable(false);

	root.createModel = {
		id: function() { return root.issueId; },
		description: ko.observable(""),
		details: ko.observable(""),
		milestoneId: ko.observable(),
		milestone: ko.observable(),
		priorityId: ko.observable(),
		priority: ko.observable(),
		statusId: ko.observable(),
		status: ko.observable(),
		typeId: ko.observable(),
		type: ko.observable(),
		developerId: ko.observable(),
		developer: ko.observable(),
		testerId: ko.observable(),
		tester: ko.observable()
	};

	root.init = function (container) {
		root.IssueProperties = new IssueTracker.IssueProperties();
		root.Upload.init(container);
	};

	root.load = function() {
		root.createModel.description("");
		root.createModel.details("");

		_setDefaultValues();

		root.Upload.reset();
		root.IssueProperties.issue = root.createModel;
	};

	root.discard = function () {
		IssueTracker.Issues.navigate();
	};

	root.save = function() {
		var error = _validate();
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_submit();
	};

	function _validate() {
		var model = root.createModel;
		if (model.description() == "")
			return "The description is required.";
		if (!model.priorityId())
			return "The priority is required.";
		if (!model.statusId())
			return "The status is required.";
		if (!model.typeId())
			return "The type is required.";
		if (!model.developerId())
			return "The developer is required.";
		if (!model.testerId())
			return "The tester is required.";
		if (!model.milestoneId())
			return "The milestone is required.";
	}

	function _submit() {
		root.loading(true);
		_send().then(function(issueId) {
			return root.Upload.upload(issueId);
		}).done(function() {
			IssueTracker.Feedback.success("Your issue has been created.");
			IssueTracker.Issues.navigate();
			IssueTracker.Notifications.refresh();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while creating your issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	function _send() {
		return $.post(IssueTracker.virtualDirectory + "issues/create", IssueTracker.Utilities.extractPropertyObservableValues(root.createModel));
	}

	function _setDefaultValues() {
		var model = root.createModel;
		model.milestone(IssueTracker.milestones()[0].name());
		model.milestoneId(IssueTracker.milestones()[0].id());
		model.priority(IssueTracker.priorities()[0].name());
		model.priorityId(IssueTracker.priorities()[0].id());
		model.status(IssueTracker.statuses()[0].name());
		model.statusId(IssueTracker.statuses()[0].id());
		model.type(IssueTracker.issueTypes()[0].name());
		model.typeId(IssueTracker.issueTypes()[0].id());

		var signedInUserId = IssueTracker.signedInUser().id();
		$.each(IssueTracker.users(), function(i, user) {
			if (user.id() == signedInUserId) {
				model.developer(user.name());
				model.developerId(user.id());
				model.tester(user.name());
				model.testerId(user.id());
			}
		});
	}

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "issues/create",
			title: "Leaf - Create Issue",
			route: "#/new-issue",
			style: "create-issue-container"
		});
	});

})(root("IssueTracker.CreateIssue"));