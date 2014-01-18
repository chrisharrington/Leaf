
(function (root) {

	root.execute = function (button) {
		if (!button)
			throw new Error("Missing transition button.");

		var transitionId = button.attr("data-transition-id");
		if (!transitionId || transitionId == "")
			throw new Error("Missing transitioner ID.");

		var transition = _getTransition(transitionId);
		var status = _getStatus(transition.toId);
		var buttonOptions = _addLoaderToButton(button);
//		$.when(_pushTransition(IssueTracker.selectedIssue.id(), status.id)).then(function () {
//			button.text(text);
//			IssueTracker.selectedIssue.status(status.name);
//			IssueTracker.selectedIssue.statusId(status.id);
//			IssueTracker.selectedIssue.transitions(_getTransitions(status.id));
//		});
	};
	
	function _addLoaderToButton(button) {
		var width = button.width();
		var text = button.text();
		button.empty().append($("<img />").attr("src", "../../images/ajax-loader.gif")).width(width);
		return { width: width, text: text };
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
