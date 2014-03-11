
(function(root) {

	root.user = ko.observable({
		name: ko.observable(""),
		emailAddress: ko.observable(""),
		developerIssueCount: ko.observable(0),
		testerIssueCount: ko.observable(0)
	});
	root.loading = ko.observable(false);

	root.create = function () {
		IssueTracker.Dialog.load("create-user-template", root);
	};

	root.save = function () {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory() + "Users/Create", root.user()).done(function() {
			IssueTracker.Feedback.success(root.user().name + " has been created.");
			IssueTracker.Users.users.push(root.user());
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while creating the user. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

})(root("IssueTracker.Users.Create"));