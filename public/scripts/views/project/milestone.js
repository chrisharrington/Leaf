(function(root) {

	var _base = IssueTracker.Project.Base;

	root.createOrUpdate = {
		type: "milestone",
		create: ko.observable(true),
		loading: ko.observable(false),
		confirm: function() { _base.confirm(root.createOrUpdate); },
		cancel: function() { IssueTracker.Dialog.hide(); },
		data: {
			name: ko.observable("")
		}
	};

	root.remove = {
		type: "milestone",
		loading: ko.observable(false),
		milestone: null,
		switchTo: [],
		confirm: function() { _base.confirmRemove(root.remove); },
		cancel: function() { IssueTracker.Dialog.hide(); }
	};

})(root("IssueTracker.Project.Milestone"));