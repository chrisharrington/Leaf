(function(root) {

	var _base = IssueTracker.Project.Base;

	root.createOrUpdate = {
		type: "status",
		create: ko.observable(true),
		loading: ko.observable(false),
		toggleDeveloper: function() { root.status.isDeveloperStatus(!root.status.isDeveloperStatus()); },
		toggleTester: function() { root.status.isTesterStatus(!root.status.isTesterStatus()); },
		toggleClosed: function() { root.status.isClosedStatus(!root.status.isClosedStatus()); },
		confirm: function() {_base.confirm(root.createOrUpdate); },
		cancel: function() { IssueTracker.Dialog.hide(); },
		data: {
			name: ko.observable(""),
			isDeveloperStatus: ko.observable(false),
			isTesterStatus: ko.observable(false),
			isClosedStatus: ko.observable(false)
		}
	};

	root.remove = {
		type: "status",
		loading: ko.observable(false),
		status: null,
		switchTo: [],
		confirm: function() { _base.confirmRemove(root.remove); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

})(root("IssueTracker.Project.Status"));