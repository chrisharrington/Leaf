
(function (root) {

	root.backStatus = ko.observable();
	root.transitioning = ko.observable(false);

	root.load = function (currentStatusId) {
		var transitions = _getTransitions(currentStatusId, true);
		var status = _getStatus(transitions[0].fromId);
		_setBackToStatus(status.id);
	};

	root.execute = function (statusId) {
		if (!statusId)
			throw new Error("Missing status ID.");

		root.transitioning(true);
		var currentStatusId = IssueTracker.selectedIssue.statusId();
		var status = _getStatus(statusId);
		$.when(_pushTransition(IssueTracker.selectedIssue.id(), status.id)).then(function () {
			IssueTracker.selectedIssue.status(status.name);
			IssueTracker.selectedIssue.statusId(status.id);
			IssueTracker.selectedIssue.transitions(_getTransitions(status.id));

			var transitions = _getTransitions(status.id, true);
			var backStatus = _getStatus(transitions[0].fromId);
			_setBackToStatus(backStatus.id);

			root.transitioning(false);
		});
	};
	
	function _setBackToStatus(statusId) {
		root.backStatus(_getStatus(statusId));
	}
	
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
	
	function _getTransitions(statusId, isTo) {
		var transitions = [];
		$.each(IssueTracker.transitions(), function(i, transition) {
			if (isTo ? transition.toId == statusId : transition.fromId == statusId)
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
