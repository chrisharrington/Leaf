IssueTracker.app.factory("usersRestoreUser", function($rootScope, userRepository, feedback) {
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

				users: function(users) {
					_scope.users = users;
				},

				ok: function() {
					_scope.loading = true;
					userRepository.restore(_scope.user).then(function() {
						feedback.success(_scope.user.name + " has been restored.");
						_scope.show = false;
						_moveUser(_scope.user);
					}).catch(function() {
						feedback.error("An error has occurred while restoring the user. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _moveUser(remove) {
				$.each(_scope.users, function(i, user) {
					if (user.id === remove.id)
						user.isDeleted = false;
				});

				$.each($rootScope.users, function(i, user) {
					if (user.id === remove.id)
						user.isDeleted = false;
				});
			}
		}
	};
});

//(function(root) {
//
//	root.loading = ko.observable(false);
//
//	root.restore = function(user) {
//		root.user = user;
//		IssueTracker.Dialog.load("confirm-undelete-user-template", root);
//	};
//
//	root.confirm = function() {
//		root.loading(true);
//		$.post(IssueTracker.virtualDirectory + "users/undelete", { id: root.user.id }).done(function() {
//			root.user.isDeleted(false);
//			_findUserInCollection(root.user).isDeleted(false);
//			IssueTracker.Dialog.hide();
//			IssueTracker.Feedback.success(root.user.name() + " has been restored.");
//		}).fail(function() {
//			IssueTracker.Feedback.error("An error has occurred while restoring " + root.user.name() + ". Please try again later.");
//		}).always(function() {
//			root.loading(false);
//		});
//	};
//
//	root.cancel = function() {
//		IssueTracker.Dialog.hide();
//	};
//
//	function _findUserInCollection(user) {
//		var found;
//		$.each(IssueTracker.users(), function(i, current) {
//			if (current.id() == user.id())
//				found = current;
//		});
//		return found;
//	}
//
//})(root("IssueTracker.Users.Undelete"));