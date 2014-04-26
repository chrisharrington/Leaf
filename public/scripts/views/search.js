(function(root) {

	root.text = ko.observable("");

	root.search = function() {
		alert(root.text());
	};

})(root("IssueTracker.Search"));