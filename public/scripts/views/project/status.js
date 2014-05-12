(function(root) {

	var _base = IssueTracker.Project.Base;

	root.status = {
		create: ko.observable(true),
		loading: ko.observable(false),
		name: ko.observable(""),
		isDeveloperStatus: ko.observable(false),
		isTesterStatus: ko.observable(false),
		isClosedStatus: ko.observable(false),
		toggleDeveloper: function() { root.status.isDeveloperStatus(!root.status.isDeveloperStatus()); },
		toggleTester: function() { root.status.isTesterStatus(!root.status.isTesterStatus()); },
		toggleClosed: function() { root.status.isClosedStatus(!root.status.isClosedStatus()); },
		confirm: function() {_base.confirm(root.status, "status"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.removeStatus = {
		loading: ko.observable(false),
		status: null,
		switchTo: [],
		confirm: function() { _base.remove(root.removeStatus, "status"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.create = function() {
		root.status.create(true);
		IssueTracker.Dialog.load("status-template", root.status);
	};

	root.edit = function(status) {
		var model = root.status;
		model.create(false);
		model.isDeveloperStatus(status.isDeveloperStatus);
		model.isTesterStatus(status.isTesterStatus);
		model.isClosedStatus(status.isClosedStatus);
		model.name(status.name);
		IssueTracker.Dialog.load("status-template", model);
	};

	root.remove = function(status) {
		var model = root.removeStatus;
		model.status = status;
		model.switchTo = [];
		$.each(IssueTracker.statuses(), function(i, current) {
			if (current.id != status.id)
				model.switchTo.push(current);
		});
		IssueTracker.Dialog.load("delete-status-template", model);
	};

})(root("IssueTracker.Project.Status"));