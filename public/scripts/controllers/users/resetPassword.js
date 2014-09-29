IssueTracker.app.factory("usersResetPassword", function(userRepository, feedback) {
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

					userRepository.resetPassword(_scope.user.id).then(function() {
						feedback.success(_scope.user.name + " has been sent a password reset email.");
						_scope.cancel();
					}).catch(function() {
						feedback.error("An error has occurred while sending the password reset email. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			}
		}
	};
});