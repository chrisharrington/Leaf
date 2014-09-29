IssueTracker.app.factory("usersDeleteUser", function($rootScope, userRepository, feedback) {
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
					userRepository.remove(_scope.user).then(function() {
						feedback.success(_scope.user.name + " has been deleted.");
						_scope.show = false;
						_removeUserFromList(_scope.user);
					}).catch(function() {
						feedback.error("An error has occurred while deleting the user. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _removeUserFromList(remove) {
				$.each(_scope.users, function(i, user) {
					if (user.id === remove.id)
						user.isDeleted = true;
				});

				$.each($rootScope.users, function(i, user) {
					if (user.id === remove.id)
						user.isDeleted = true;
				});
			}
		}
	};
});

//(function(root) {
//
//	root.user = ko.observable();
//	root.loading = ko.observable(false);
//
//	root.remove = function (user) {
//		root.user(user);
//		IssueTracker.Dialog.load("confirm-delete-user-template", root);
//	};
//
//	root.confirm = function () {
//		root.loading(true);
//		$.post(IssueTracker.virtualDirectory + "users/delete", root.user()).done(function() {
//			IssueTracker.Feedback.success(root.user().name() + " has been deleted.");
//			IssueTracker.Dialog.hide();
//			_removeUserFromList();
//		}).fail(function (response) {
//			if (response.status == 403)
//				IssueTracker.Feedback.error("You can't delete the last user.");
//			else
//				IssueTracker.Feedback.error("An error has occurred while deleting the user. Please try again later.");
//		}).always(function() {
//			root.loading(false);
//		});
//	};
//
//	root.cancel = function() {
//		IssueTracker.Dialog.hide();
//	};
//
//	function _removeUserFromList() {
//		$.each(IssueTracker.Users.users(), function(i, user) {
//			if (user.id() == root.user().id())
//				user.isDeleted(true);
//		});
//
//		$.each(IssueTracker.users(), function(i, user) {
//			if (user.id() == root.user().id())
//				user.isDeleted(true);
//		});
//	}
//
//})(root("IssueTracker.Users.DeleteUser"));