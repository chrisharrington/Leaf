(function(root) {

	root.confirm = function(model, type) {
		var error = _validate(model);
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_send(model, type);
	};

	root.remove = function(model, type) {
		model.loading(true);
		$.post(IssueTracker.virtualDirectory + "project/" + type + "/delete", { id: model.id }).done(function() {
			IssueTracker.Dialog.hide();
			_getCollection(type).remove(function(current) {
				return current.id == model.id;
			});
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the " + type + ". Please try again later.");
		}).always(function() {
			model.loading(false);
		});
	};

	function _validate(model) {
		if (model.name() == "")
			return "The name is required.";
	}

	function _send(model, type) {
		model.loading(true);
		$.post(IssueTracker.virtualDirectory + "project/" + type, IssueTracker.Utilities.extractPropertyObservableValues(model)).done(function(created) {
			IssueTracker.Dialog.hide();
			_getCollection(type).push(created);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while creating the " + type + ". Please try again later.");
		}).always(function() {
			model.loading(false);
		});
	}

	function _getCollection(type) {
		switch (type) {
			case "milestone":
				return IssueTracker.milestones();
			case "priority":
				return IssueTracker.priorities();
			case "status":
				return IssueTracker.statuses();
		}
	}

})(root("IssueTracker.Project.Base"));