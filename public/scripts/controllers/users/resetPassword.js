IssueTracker.app.factory("usersResetPassword", function() {
	var _scope;

	return {
		init: function() {
			return _scope = {
				show: false,
				loading: false,

				load: function(user) {
					_scope.user = user;
					_scope.show = true;
				},

				ok: function() {
					_scope.loading = true;
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			}
		}
	};
});