(function(root) {

	var _container;
	var _template;

	root.init = function(template, trigger) {
		_template = template;

		$(trigger).on("click", _load);
	};

	root.toggle = function(setting) {
		var on = IssueTracker.signedInUser()[setting]();
		IssueTracker.signedInUser()[setting](!on);
	};

	function _load() {
		IssueTracker.Dialog.load(_template);
	}

})(root("IssueTracker.UserSettings.EmailNotifications"));