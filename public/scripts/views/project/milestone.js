(function(root) {

	root.loading = ko.observable(false);
	root.switch = ko.observable();

	root.saveModel = {
		type: "milestone",
		id: ko.observable(),
		name: ko.observable("")
	};

	root.removeModel = {
		id: null,
		newMilestones: null,
		newMilestone: ko.observable()
	};

	root.create = function() {
		root.saveModel.create = true;
		IssueTracker.Dialog.load("create-or-update-milestone-template", root.saveModel).find("input:first").focus();
	};

	root.edit = function(milestone) {
		var model = root.saveModel;
		model.create = false;
		model.id(milestone.id());
		model.name(milestone.name());
		IssueTracker.Dialog.load("create-or-update-milestone-template", root.saveModel).find("input:first").focus();
	};

	root.remove = function(milestone) {
		var model = root.removeModel;
		model.id = milestone.id;
		model.newMilestones = [];
		model.newMilestone(null);
		$.each(IssueTracker.milestones(), function(i, current) {
			if (current.id() != milestone.id())
				model.newMilestones.push(current);
		});
		IssueTracker.Dialog.load("delete-milestone-template", model);
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	root.confirmSave = function() {
		if (root.saveModel.name() == "")
			IssueTracker.Feedback.error("The name is required.");

		var create = root.saveModel.create;
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "milestone/save", { id: root.saveModel.id(), name: root.saveModel.name() }).done(function(saved) {
			if (create)
				IssueTracker.milestones.push(IssueTracker.Utilities.createPropertyObservables(saved));
			else {
				$.each(IssueTracker.milestones(), function(i, milestone) {
					if (milestone.id() == saved.id)
						milestone.name(saved.name);
				});
			}
			IssueTracker.Feedback.success("The milestone has been saved.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while saving your milestone. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.confirmRemove = function() {
		var model = root.removeModel;
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "milestone/delete", { id: model.id, switchTo: model.newMilestone }).done(function() {
			IssueTracker.milestones.remove(function(current) {
				return current.id == model.id;
			});
			IssueTracker.Dialog.hide();
			IssueTracker.Feedback.success("The milestone has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the milestone. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

})(root("IssueTracker.Project.Milestone"));