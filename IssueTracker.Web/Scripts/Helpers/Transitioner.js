
(function (root) {

	var _currentStatusId;

	root.transitioning = ko.observable(false);

	root.execute = function (statusId) {
		if (!statusId)
			throw new Error("Missing status ID.");

		_currentStatusId = statusId;
		var status = _getStatus(statusId);
		IssueTracker.selectedIssue.status(status.name);
		IssueTracker.selectedIssue.statusId(status.id);
		IssueTracker.selectedIssue.transitions(_getTransitions(status.id));
	};

	root.save = function () {
		_pushTransition(IssueTracker.selectedIssue.id(), _currentStatusId);
	};
	
	function _getStatus(statusId) {
		var found;
		$.each(IssueTracker.statuses(), function(i, status) {
			if (status.id == statusId) {
				found = status;
				return false;
			}
		});

		if (found)
			return found;
		else
			throw new Error("No status was found with status ID \"" + statusId + "\".");
	}
	
	function _getTransitions(statusId, isTo) {
		var transitions = [];
		$.each(IssueTracker.transitions(), function(i, transition) {
			if (isTo ? transition.toId == statusId : transition.fromId == statusId)
				transitions.push(transition);
		});
		return transitions;
	}
	
	function _pushTransition(issueId, statusId) {
		root.transitioning(true);
		$.post(IssueTracker.virtualDirectory() + "Issues/ExecuteTransition", { issueId: issueId, statusId: statusId }).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while performing the transition. Please try again later.");
		}).always(function() {
			root.transitioning(false);
		});
	}

})(root("IssueTracker.Transitioner"));
