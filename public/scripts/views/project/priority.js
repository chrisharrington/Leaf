(function(root) {

	root.loading = ko.observable(false);
	root.switch = ko.observable();

	root.saveModel = {
		type: "priority",
		id: ko.observable(),
		name: ko.observable("")
	};

	root.removeModel = {
		id: null,
		newPriorities: null,
		newPriority: ko.observable()
	};

	root.create = function() {
		root.saveModel.create = true;
		IssueTracker.Dialog.load("create-or-update-priority-template", root.saveModel).find("input:first").focus();
	};

	root.edit = function(priority) {
		var model = root.saveModel;
		model.create = false;
		model.id(priority.id());
		model.name(priority.name());
		IssueTracker.Dialog.load("create-or-update-priority-template", root.saveModel).find("input:first").focus();
	};

	root.remove = function(priority) {
		var model = root.removeModel;
		model.id = priority.id;
		model.newPriorities = [];
		model.newPriority(null);
		$.each(IssueTracker.priorities(), function(i, current) {
			if (current.id() != priority.id())
				model.newPriorities.push(current);
		});
		IssueTracker.Dialog.load("delete-priority-template", model);
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
		$.post(IssueTracker.virtualDirectory + "priorities/save", { id: root.saveModel.id(), name: root.saveModel.name(), order: _getHighestOrder()+1 }).done(function(saved) {
			if (create)
				IssueTracker.priorities.push(IssueTracker.Utilities.createPropertyObservables(saved));
			else {
				$.each(IssueTracker.priorities(), function(i, priority) {
					if (priority.id() == saved.id)
						priority.name(saved.name);
				});
			}
			IssueTracker.Feedback.success("The priority has been saved.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while saving your priority. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.confirmRemove = function() {
		var model = root.removeModel;
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "priorities/delete", { id: model.id, switchTo: model.newPriority }).done(function() {
			IssueTracker.priorities.remove(function(current) {
				return current.id == model.id;
			});
			IssueTracker.Dialog.hide();
			IssueTracker.Feedback.success("The priority has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the priority. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	function _getHighestOrder() {
		var order = -1;
		$.each(IssueTracker.priorities(), function(i, priority) {
			order = Math.max(priority.order(), order);
		});
		return order;
	}

})(root("IssueTracker.Project.Priority"));