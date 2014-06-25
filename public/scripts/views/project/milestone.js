(function(root) {

	var _container;

	root.ordering = ko.observable(false);
	root.loading = ko.observable(false);

	root.saveModel = {
		type: "milestone",
		id: ko.observable(),
		name: ko.observable(""),
		order: ko.observable(0)
	};

	root.init = function(container) {
		_container = container;
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
		model.order(_getHighestOrder());
		IssueTracker.Dialog.load("create-or-update-milestone-template", model).find("input:first").focus();
	};

	root.edit = function(milestone) {
		var model = root.saveModel;
		model.create = false;
		model.id(milestone.id());
		model.name(milestone.name());
		model.order(milestone.order());
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
		$.post(IssueTracker.virtualDirectory + "milestones/save", { id: root.saveModel.id(), name: root.saveModel.name(), order: root.saveModel.order() }).done(function(saved) {
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

	root.order = function() {
		root.ordering(true);
		_container.find("#milestones tbody").sortable("enable");
	};

	root.cancelOrder = function() {
		root.ordering(false);
		_container.find("#milestones tbody").sortable("cancel").sortable("disable");
	};

	root.saveOrder = function() {
		var rows = _container.find("#milestones tbody tr");
		_setMilestonesOrder(rows);
		$.post(IssueTracker.virtualDirectory + "milestones/order", { milestones: IssueTracker.Utilities.extractPropertyObservableValuesFromArray(IssueTracker.milestones()) }).done(function() {
			IssueTracker.Feedback.success("The new milestone order has been applied.");
			root.ordering(false);
		}).fail(function() {
			IssueTracker.Feedback.error("An error occurred while updating the milestone order. Please try again later.");
		});
	};

	function _setMilestonesOrder(rows) {
		$(rows).each(function(i, row) {
			var id = $(row).attr("data-id");
			$.each(IssueTracker.milestones(), function(j, milestone) {
				if (milestone.id() == id)
					milestone.order(i+1);
			});
		});

		IssueTracker.milestones.sort(function(first, second) { return first.order() < second.order() ? -1 : 1; });
	}

	function _getHighestOrder() {
		var order = -1;
		$.each(IssueTracker.milestones(), function(i, milestone) {
			order = Math.max(milestone.order(), order);
		});
		return order;
	}

})(root("IssueTracker.Project.Milestone"));