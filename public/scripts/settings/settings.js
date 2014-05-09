(function(root) {

	var _menu;

	root.init = function(container) {
		_menu = IssueTracker.SlideMenu.build(container);
	};

	root.show = function() {
		_menu.show();
	};

})(root("IssueTracker.Settings"));