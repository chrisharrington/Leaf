
(function (root) {

	root.execute = function (transitionId) {
		if (!transitionId || transitionId == "")
			throw new Error("Missing transitioner ID.");

		var transition = _getTransition(transitionId);
		var status = _getStatus(transition.toId);
		IssueTracker.selectedIssue.status(status.name);
		IssueTracker.selectedIssue.statusId(status.id);
		IssueTracker.selectedIssue.transitions(_getTransitions(status.id));
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

})(root("IssueTracker.Transitioner"));
