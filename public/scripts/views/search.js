(function(root) {

	root.loading = ko.observable(false);
	root.text = ko.observable("");
	root.results = ko.observableArray();

	root.go = function() {
		if (root.text() != "")
			root.navigate({ text: root.text().trim().replace(/ /g, "-") });
	};

	root.init = function() {
		root.results.extend({ rateLimit: 50 });
	};

	root.preload = function(args) {
		if (root.text() == "")
			root.text(args.text.replace(/-/g, " "));

		root.results.removeAll();
		root.loading(true);
		_getSearchResults(root.text()).done(function(results) {
			root.results.pushAll(results.issues);
		}).always(function() {
			root.loading(false);
		});
	};

	function _getSearchResults(text) {
		return $.ajax({
			url: IssueTracker.virtualDirectory + "search/query",
			data: { text: text },
			global: false
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while performing your search. Please try again later.");
		});
	}

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "search",
			route: "#/search/:text",
			style: "search-container"
		});
	});

})(root("IssueTracker.Search"));