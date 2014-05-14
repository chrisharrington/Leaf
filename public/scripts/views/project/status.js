(function(root) {

	root.loading = ko.observable(false);
	root.switch = ko.observable();

	root.saveModel = {
		type: "status",
		id: ko.observable(),
		name: ko.observable(""),
		isClosedStatus: ko.observable(false),
		isDeveloperStatus: ko.observable(false),
		isTesterStatus: ko.observable(false),
		order: ko.observable(0)
	};

	root.removeModel = {
		id: null,
		newStatuses: null,
		newStatus: ko.observable()
	};

	root.create = function() {
		var model = root.saveModel;
		model.create = true;
		model.id("");
		model.name("");
		model.isClosedStatus(false);
		model.isDeveloperStatus(false);
		model.isTesterStatus(false);
		IssueTracker.Dialog.load("create-or-update-status-template", model).find("input:first").focus();
	};

	root.edit = function(status) {
		var model = root.saveModel;
		model.create = false;
		model.id(status.id());
		model.name(status.name());
		model.isClosedStatus(status.isClosedStatus());
		model.isDeveloperStatus(status.isDeveloperStatus());
		model.isTesterStatus(status.isTesterStatus());
		model.order(status.order());
		IssueTracker.Dialog.load("create-or-update-status-template", model).find("input:first").focus();
	};

	root.remove = function(status) {
		var model = root.removeModel;
		model.id = status.id;
		model.newStatuses = [];
		model.newStatus(null);
		$.each(IssueTracker.statuses(), function(i, current) {
			if (current.id() != status.id())
				model.newStatuses.push(current);
		});
		IssueTracker.Dialog.load("delete-status-template", model);
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
		$.post(IssueTracker.virtualDirectory + "statuses/save", {
			id: root.saveModel.id(),
			name: root.saveModel.name(),
			isClosedStatus: root.saveModel.isClosedStatus(),
			isDeveloperStatus: root.saveModel.isDeveloperStatus(),
			isTesterStatus: root.saveModel.isTesterStatus(),
			order: create ? (_getHighestOrder()+1) : root.saveModel.order()
		}).done(function(saved) {
			saved.isClosedStatus = saved.isClosedStatus == "true";
			saved.isDeveloperStatus = saved.isDeveloperStatus == "true";
			saved.isTesterStatus = saved.isTesterStatus == "true";
			if (create)
				IssueTracker.statuses.push(IssueTracker.Utilities.createPropertyObservables(saved));
			else {
				for (var i = 0; i < IssueTracker.statuses().length; i++) {
					var status = IssueTracker.statuses()[i];
					var statusId = status.id();
					var savedId = saved.id;
					if (statusId == savedId) {
						status.name(saved.name);
						status.isClosedStatus(saved.isClosedStatus);
						status.isDeveloperStatus(saved.isDeveloperStatus);
						status.isTesterStatus(saved.isTesterStatus);
					}
				}
			}
			IssueTracker.Feedback.success("The status has been saved.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while saving your status. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.confirmRemove = function() {
		var model = root.removeModel;
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "statuses/delete", { id: model.id, switchTo: model.newStatus }).done(function() {
			IssueTracker.statuses.remove(function(current) {
				return current.id == model.id;
			});
			IssueTracker.Dialog.hide();
			IssueTracker.Feedback.success("The status has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the status. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.toggleDeveloper = function() {
		root.saveModel.isDeveloperStatus(!root.saveModel.isDeveloperStatus());
	};

	root.toggleTester = function() {
		root.saveModel.isTesterStatus(!root.saveModel.isTesterStatus());
	};

	root.toggleClosed = function() {
		root.saveModel.isClosedStatus(!root.saveModel.isClosedStatus());
	};

	function _getHighestOrder() {
		var order = -1;
		$.each(IssueTracker.statuses(), function(i, status) {
			order = Math.max(status.order(), order);
		});
		return order;
	}

})(root("IssueTracker.Project.Status"));