
(function(root) {

	(function() {
		$(document).on("click", "div.global-feedback i.fa-times", function() {
			root.clear();
		});
	})();

	root.error = function (key) {
		IssueTracker.error(Restokk.localize(key, Array.prototype.slice.call(arguments, 1)));
	};

	root.clear = function() {
		IssueTracker.error("");
	};

})(root("IssueTracker.Feedback"));