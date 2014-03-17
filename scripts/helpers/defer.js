
(function(root) {

	root.execute = function(func, timeout) {
		setTimeout(func, timeout);
	};

})(root("IssueTracker.Defer"));