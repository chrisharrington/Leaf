
(function(root) {

	root.init = function () {
		$("#project-switcher").click(function() {
			var popupContainer = IssueTracker.Popup.load({ view: "#project-switcher-dialog", anchor: $(this), trigger: $(this), verticalOffset: 12 });
			popupContainer.on("click", ">div", function () {
				if ($(this).hasClass("selected"))
					return;
				IssueTracker.selectedProject($.parseJSON($(this).attr("data-project")));
				IssueTracker.Popup.hide();
				IssueTracker.Issues.reset();
			});
		});
	};

})(root("IssueTracker.Header"));