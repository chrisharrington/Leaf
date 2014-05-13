(function(root) {

	root.confirm = function(model) {
		var error = _validate(model);
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_send(model);
	};

	root.create = function(model) {
		model.create(true);
		model.data.name("");
		IssueTracker.Dialog.load("create-template", model).find("input:first").focus();
	};

	root.edit = function(model, data) {
		model.create(false);
		model.data.name(data.name);
		if (model.type == "status") {
			model.data.isDeveloperStatus(data.isDeveloperStatus);
			model.data.isTesterStatus(data.isTesterStatus);
			model.data.isClosedStatus(data.isClosedStatus);
		}
		IssueTracker.Dialog.load("create-template", model).find("input:first").focus();
	};

	root.remove = function(model, data) {
		model[model.type] = data;
		model.switchTo = [];
		$.each(_getCollection(model.type), function(i, current) {
			if (current.id != data.id)
				model.switchTo.push(current);
		});
		IssueTracker.Dialog.load("delete-template", model);
	};

	root.confirmRemove = function(model) {
		model.loading(true);
		$.post(IssueTracker.virtualDirectory + model.type + "/delete", { type: model.type, id: model.id }).done(function() {
			IssueTracker.Dialog.hide();
			_getCollection(model.type).remove(function(current) {
				return current.id == model.id;
			});
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the " + model.type + ". Please try again later.");
		}).always(function() {
			model.loading(false);
		});
	};

	function _validate(model) {
		if (model.data.name() == "")
			return "The name is required.";
	}

	function _send(model) {
		model.loading(true);
		$.post(IssueTracker.virtualDirectory + model.type + "/save", IssueTracker.Utilities.extractPropertyObservableValues(model.data)).done(function(created) {
			IssueTracker.Dialog.hide();
			_getCollection(model.type).push(created);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while " + (model.create() ? "creating" : "editing") + " the " + model.type + ". Please try again later.");
		}).always(function() {
			model.loading(false);
		});
	}

	function _getCollection(type) {
		switch (type) {
			case "milestone":
				return IssueTracker.milestones;
			case "priority":
				return IssueTracker.priorities;
			case "status":
				return IssueTracker.statuses;
		}
	}

})(root("IssueTracker.Project.Base"));