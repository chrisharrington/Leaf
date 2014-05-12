(function(root) {

	root.load = function(local, url) {
		$.getScript(window.location.href.indexOf("leafissuetracker.com") > -1 ? url : local);
	};

})(root("IssueTracker.Loader"));