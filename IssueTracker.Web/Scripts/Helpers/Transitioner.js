
(function (root) {

	root.transitioning = ko.observable(false);

	root.execute = function (transitionId) {
		if (!transitionId)
			throw new Error("Missing transition transition ID.");

		var transition = _getTransition(transitionId);
		var status = _getStatus(transition.toId);
		root.transitioning(true);
		$.when(_pushTransition(IssueTracker.selectedIssue.id(), status.id)).then(function () {
			IssueTracker.selectedIssue.status(status.name);
			IssueTracker.selectedIssue.statusId(status.id);
			IssueTracker.selectedIssue.transitions(_getTransitions(status.id));
			root.transitioning(false);
		});
	};
	
	function _getTransition(transitionId) {
		var found;
		$.each(IssueTracker.transitions(), function(i, transition) {
			if (transition.id == transitionId) {
				found = transition;
				return false;
			}
		});

		if (found)
			return found;
		else
			throw new Error("No transition found for transition ID \"" + transitionId + "\".");
	}
	
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
	
	function _getTransitions(statusId) {
		var transitions = [];
		$.each(IssueTracker.transitions(), function(i, transition) {
			if (transition.fromId == statusId)
				transitions.push(transition);
		});
		return transitions;
	}
	
	function _pushTransition(issueId, statusId) {
		return $.post(IssueTracker.virtualDirectory() + "Issues/ExecuteTransition", { issueId: issueId, statusId: statusId }).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while performing the transition. Please try again later.");
		});
	}

})(root("IssueTracker.Transitioner"));
