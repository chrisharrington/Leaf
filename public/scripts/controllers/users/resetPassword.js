IssueTracker.app.factory("usersResetPassword", function() {
	var _scope;

	return {
		init: function() {
			return _scope = {
				show: false,
				load: function(user) {
					_scope.show = true;
				}
			}
		}
	};
});