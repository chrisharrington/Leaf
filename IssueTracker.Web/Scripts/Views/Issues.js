
(function (root) {

	var _issueCountToLoad = 15;
	var _start = 0;
	var _nextIssuesRunning = false;
	var _allLoaded = false;
	var _filter;
	var _loader;

	root.list = ko.observableArray();
	root.tags = ko.observableArray();
	
	root.filter = ko.observable("");

	root.load = function (container) {
		_loader = container.find("table tfoot");
		_setupFilter(container);
		_setupLoadingMoreIssues();
		_getNextIssues(25);

		root.tags.push({ type: "Owner", value: "Chris Harrington" });
		root.tags.push({ type: "Priority", value: "Critical" });
	};
	
	function _setupFilter(container) {
		_filter = container.find("div.filter");
		_filter.on("focus", "input[type='text']", function() { _filter.addClass("focus"); });
		_filter.on("blur", "input[type='text']", function () { _filter.removeClass("focus"); });
		_filter.on("click", "i", function () { _filter.find("input[type='text']").val("").keyup(); });
		_filter.click(function () { $(this).find("input").focus(); });
	}
	
	function _setupLoadingMoreIssues() {
		$(window).scroll(function () {
			if ($(window).scrollTop() + $(window).height() > $(document).height() - 200)
				_getNextIssues(_issueCountToLoad);
		});
	}
	
	function _getNextIssues(count) {
		if (_nextIssuesRunning === true || _allLoaded === true)
			return;

		_loader.show();
		_nextIssuesRunning = true;
		$.get(IssueTracker.virtualDirectory() + "Issues/Next?start=" + (_start+1) + "&end=" + (count+_start)).success(function(issues) {
			root.list.pushAll(issues);
			if (issues.length < count)
				_allLoaded = true;
		}).error(function() {
			alert("An error has occurred while retrieving the next set of issues. Please try again later.");
		}).complete(function() {
			_nextIssuesRunning = false;
			_loader.hide();
		});
		_start += count;
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues",
		title: "Issues",
		route: "#/issues",
		style: "issues-container"
	});

})(root("IssueTracker.Issues"));
