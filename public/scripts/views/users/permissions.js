(function(root) {

	root.loading = ko.observable(false);
	root.name = ko.observable();

	root.load = function(user) {
		root.name(user.name());
		IssueTracker.Dialog.load("user-permissions", root);
	};

	root.save = function() {
		alert("save");
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

})(root("IssueTracker.Users.Permissions"));