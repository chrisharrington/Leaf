
(function (root) {

	var _currentStatusId;
	var _transitions;
	var _statuses;

	root.transitioning = ko.observable(false);

	root.init = function() {
		_transitions = {};
		$.each(IssueTracker.transitions(), function(i, transition) {
			if (!_transitions[transition.fromId])
				_transitions[transition.fromId] = [];
			_transitions[transition.fromId].push(transition);
		});

		_statuses = {};
		$.each(IssueTracker.statuses(), function(i, status) {
			_statuses[status.id] = status;
		});
	};

	root.execute = function (statusId) {
		if (!statusId)
			throw new Error("Missing status ID.");

		_currentStatusId = statusId;
		var status = _statuses[statusId];
		IssueTracker.selectedIssue.status(status.name);
		IssueTracker.selectedIssue.statusId(status.id);
		IssueTracker.selectedIssue.transitions(_transitions[status.id] ? _transitions[status.id] : []);
	};

	root.save = function () {
		_pushTransition(IssueTracker.selectedIssue.id(), _currentStatusId);
	};
	
	function _pushTransition(issueId, statusId) {
		root.transitioning(true);
		$.post(IssueTracker.virtualDirectory() + "Issues/ExecuteTransition", { issueId: issueId, statusId: statusId }).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while performing the transition. Please try again later.");
		}).always(function() {
			root.transitioning(false);
		});
	}

})(root("IssueTracker.Transitioner"));
