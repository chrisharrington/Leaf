(function(root) {

	root.loading = ko.observable(false);

	root.saveModel = {
		type: "milestone",
		id: ko.observable(),
		name: ko.observable("")
	};

	root.sortable = function(container) {
		container.find("#milestones tbody").sortable({
			axis: "y",
			helper: function(e, tr) {
				var originals = tr.children();
				var helper = tr.clone().addClass("dragging");
				helper.children().each(function(index) {
					$(this).width(originals.eq(index).width());
				});
				return helper;
			},
			update: function() {
				_updateOrder(container.find("#milestones tbody tr"));
			}
		});
	};

	root.removeModel = {
		id: null,
		newMilestones: null,
		newMilestone: ko.observable()
	};

	root.create = function() {
		var model = root.saveModel;
		model.create = true;
		model.id("");
		model.name("");
		IssueTracker.Dialog.load("create-or-update-milestone-template", model).find("input:first").focus();
	};

	root.edit = function(milestone) {
		var model = root.saveModel;
		model.create = false;
		model.id(milestone.id());
		model.name(milestone.name());
		IssueTracker.Dialog.load("create-or-update-milestone-template", model).find("input:first").focus();
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
		if (root.saveModel.name() == "") {
			IssueTracker.Feedback.error("The name is required.");
			return;
		}

		var create = root.saveModel.create;
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "milestones/save", { id: root.saveModel.id(), name: root.saveModel.name() }).done(function(saved) {
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
		$.post(IssueTracker.virtualDirectory + "milestones/delete", { id: model.id, switchTo: model.newMilestone }).done(function() {
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

	function _updateOrder(rows) {
		_setMilestonesOrder(rows);
		$.post(IssueTracker.virtualDirectory + "milestones/order", { milestones: IssueTracker.Utilities.extractPropertyObservableValuesFromArray(IssueTracker.milestones()) }).done(function() {
			IssueTracker.Feedback.success("The new milestone order has been applied.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while updating the milestone order. Please try again later.");
		});
	}

	function _setMilestonesOrder(rows) {
		$(rows).each(function(i, row) {
			var id = $(row).attr("data-id");
			$.each(IssueTracker.milestones(), function(j, milestone) {
				if (milestone.id() == id)
					milestone.order(i+1);
			});
		});
	}

})(root("IssueTracker.Project.Milestone"));