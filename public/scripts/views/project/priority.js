(function(root) {

	var _base = IssueTracker.Project.Base;

	root.priority = {
		loading: ko.observable(false),
		name: ko.observable(""),
		confirm: function() { _base.confirm(root.priority, "priority"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.removePriority = {
		loading: ko.observable(false),
		priority: null,
		switchTo: [],
		confirm: function() { _base.remove(root.removePriority, "priority"); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

	root.create = function() {
		root.priority.create(true);
		IssueTracker.Dialog.load("priority-template", root.priority);
	};

	root.edit = function(priority) {
		var model = root.priority;
		model.create(false);
		model.name(priority.name);
		IssueTracker.Dialog.load("priority-template", model);
	};

	root.remove = function(priority) {
		var model = root.removePriority;
		model.priority = priority;
		model.switchTo = [];
		$.each(IssueTracker.priorities(), function(i, current) {
			if (current.id != priority.id)
				model.switchTo.push(current);
		});
		IssueTracker.Dialog.load("delete-priority-template", model);
	};

})(root("IssueTracker.Project.Priority"));