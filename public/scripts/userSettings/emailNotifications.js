(function(root) {

	var _container;
	var _template;

	root.init = function(template, trigger) {
		_template = template;

		$(trigger).on("click", _load);
	};

	function _load() {
		IssueTracker.Dialog.load(_template);
	}

})(root("IssueTracker.UserSettings.EmailNotifications"));