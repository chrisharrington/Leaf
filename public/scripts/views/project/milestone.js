(function(root) {

	var _base = IssueTracker.Project.Base;

	root.milestone = {
		create: ko.observable(true),
		loading: ko.observable(false),
		name: ko.observable(""),
		confirm: function() { _base.confirm(root.milestone, "milestone"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.removeMilestone = {
		loading: ko.observable(false),
		milestone: null,
		switchTo: [],
		confirm: function() { _base.remove(root.removeMilestone, "milestone"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.create = function() {
		root.milestone.create(true);
		IssueTracker.Dialog.load("milestone-template", root.milestone);
	};

	root.edit = function(milestone) {
		var model = root.milestone;
		model.create(false);
		model.name(milestone.name);
		IssueTracker.Dialog.load("milestone-template", model);
	};

	root.remove = function(milestone) {
		var model = root.removeMilestone;
		model.milestone = milestone;
		model.switchTo = [];
		$.each(IssueTracker.milestones(), function(i, current) {
			if (current.id != milestone.id)
				model.switchTo.push(current);
		});
		IssueTracker.Dialog.load("delete-milestone-template", model);
	};

})(root("IssueTracker.Project.Milestone"));