
(function (root) {

	root.list = ko.observableArray();
	root.tags = ko.observableArray();
	
	root.filter = ko.observable("");

	root.load = function(container) {
		_setupFilter(container);

		root.tags.push({ type: "Owner", value: "Chris Harrington" });
		root.tags.push({ type: "Priority", value: "Critical" });
	};
	
	function _setupFilter(container) {
		var filter = container.find("div.filter");
		filter.on("focus", "input[type='text']", function() { filter.addClass("focus"); });
		filter.on("blur", "input[type='text']", function () { filter.removeClass("focus"); });
		filter.on("click", "i", function () { filter.find("input[type='text']").val("").keyup(); });
		filter.click(function() { $(this).find("input").focus(); });
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues",
		title: "Issues",
		route: "#/issues",
		style: "issues-container"
	});

})(root("IssueTracker.Issues"));
