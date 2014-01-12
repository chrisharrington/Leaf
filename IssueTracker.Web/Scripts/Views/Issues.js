
(function (root) {

	var _issueCountToLoad = 15;
	var _start = 25;
	var _nextIssuesRunning = false;
	var _filter;

	root.list = ko.observableArray();
	root.tags = ko.observableArray();
	
	root.filter = ko.observable("");

	root.load = function(container) {
		_setupFilter(container);
		_setupLoadingMoreIssues();

		root.tags.push({ type: "Owner", value: "Chris Harrington" });
		root.tags.push({ type: "Priority", value: "Critical" });
	};
	
	function _setupFilter(container) {
		_filter = container.find("div.filter");
		_filter.on("focus", "input[type='text']", function() { _filter.addClass("focus"); });
		_filter.on("blur", "input[type='text']", function () { _filter.removeClass("focus"); });
		_filter.on("click", "i", function () { _filter.find("input[type='text']").val("").keyup(); });
		_filter.click(function () { $(this).find("input").focus(); });
		_filter.find("input").on("focus", function() { _slideFilter(true); }).on("blur", function() { _slideFilter(false); });
	}
	
	function _setupLoadingMoreIssues() {
		$(window).scroll(function () {
			if ($(window).scrollTop() + $(window).height() > $(document).height() - 100)
				_getNextIssues();
		});
	}
	
	function _getNextIssues() {
		if (_nextIssuesRunning === true)
			return;

		_nextIssuesRunning = true;
		$.get(IssueTracker.virtualDirectory() + "Issues/Next?start=" + _start + "&count=" + _issueCountToLoad).success(function(issues) {
			root.list.pushAll(issues);
		}).error(function() {
			alert("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).complete(function() {
			_nextIssuesRunning = false;
		});
		_start += _issueCountToLoad;
	}

	function _slideFilter(isOpen) {
		_filter.find("input").animate({ width: isOpen ? "600px" : "300px" }, 200);
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues",
		title: "Issues",
		route: "#/issues",
		style: "issues-container"
	});

})(root("IssueTracker.Issues"));
