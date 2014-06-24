(function (root) {

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
			update: function(e, ui) {
				var table = $(e.target).closest("table");
				var id = table.attr("id"), rows = table.find("tbody tr");
				if (id == "milestones")
					root.Milestone.order(rows);
				else if (id == "priorities")
					root.Priority.order(rows);
			}
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
