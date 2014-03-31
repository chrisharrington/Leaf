(function(root) {

	var _container;
	var _menu;

	root.init = function(container, trigger) {
		IssueTracker.SlideMenu.build(container, trigger);
	}

})(root("IssueTracker.UserSettings"));