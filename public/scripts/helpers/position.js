
(function(root) {

	root.isElementTopHalfOfWindow = function(element) {
		return element.offset().top <= $(window).height() / 2;
	};

	root.isElementLeftHalfOfWindow = function(element) {
		return element.offset().left <= $(window).width() / 2;
	};

})(root("IssueTracker.Position"));