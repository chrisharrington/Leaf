(function (root) {

	var _container;

	root.orderingMilestones = ko.observable(false);

	root.init = function(container) {
		root.Milestone.init(container);
	};

	root.load = function(container) {
		container.find("tbody").sortable({
			axis: "y",
			helper: function(e, tr) {
				var originals = tr.children();
				var helper = tr.clone().addClass("dragging");
				helper.children().each(function(index) {
					$(this).width(originals.eq(index).width());
				});
				return helper;
			},
			disabled: true
		});
	};

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "project/settings",
			title: "Leaf - Project Settings",
			route: "#/project/settings",
			style: "project-container"
		});
	});

})(root("IssueTracker.Project"));
