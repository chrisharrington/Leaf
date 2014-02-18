
(function(root) {

	(function() {
		$(document).on("click", "div.global-feedback i.fa-times", function() {
			root.clear();
		});
	})();

	root.error = function (message) {
		IssueTracker.error(message);
	};

	root.clear = function() {
		IssueTracker.error("");
	};

})(root("IssueTracker.Feedback"));