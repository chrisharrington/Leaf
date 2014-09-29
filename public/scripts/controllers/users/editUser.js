IssueTracker.app.factory("usersEditUser", function($rootScope, userRepository, feedback) {
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
					userRepository.update(_scope.user).then(function() {
						feedback.success(_scope.user.name + " has been updated.");
						_scope.show = false;
						_updateUser(_scope.user);
					}).catch(function() {
						feedback.error("An error has occurred while updating the user. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _updateUser(user) {
//				$.each(IssueTracker.Users.users(), function(i, user) {
//					if (user.id() == root.user().id()) {
//						user.name(root.user().name());
//						user.emailAddress(root.user().emailAddress());
//					}
//				});
//
//				$.each(IssueTracker.users(), function(i, user) {
//					if (user.id() == root.user().id()) {
//						user.name(root.user().name());
//						user.emailAddress(root.user().emailAddress());
//					}
//				});
			}
		}
	};
});

//
//(function (root) {
//
//	root.user = ko.observable();
//	root.loading = ko.observable(false);
//
//	root.edit = function (user) {
//		root.user(user);
//		IssueTracker.Dialog.load("edit-user-template", root);
//	};
//
//	root.save = function () {
//		root.loading(true);
//		$.post(IssueTracker.virtualDirectory + "users/edit", root.user()).done(function() {
//			IssueTracker.Feedback.success(root.user().name() + " has been saved.");
//			IssueTracker.Dialog.hide();
//			_updateUserInList();
//			_updateSignedInUser();
//		}).fail(function () {
//			IssueTracker.Feedback.error("An error has occurred while editing the user. Please try again later.");
//		}).always(function() {
//			root.loading(false);
//		});
//	};
//
//	root.cancel = function() {
//		IssueTracker.Dialog.hide();
//	};
//
//	function _updateUserInList() {
//		$.each(IssueTracker.Users.users(), function(i, user) {
//			if (user.id() == root.user().id()) {
//				user.name(root.user().name());
//				user.emailAddress(root.user().emailAddress());
//			}
//		});
//
//		$.each(IssueTracker.users(), function(i, user) {
//			if (user.id() == root.user().id()) {
//				user.name(root.user().name());
//				user.emailAddress(root.user().emailAddress());
//			}
//		});
//	}
//
//	function _updateSignedInUser() {
//		if (IssueTracker.signedInUser().id() != root.user().id())
//			return;
//
//		IssueTracker.Utilities.copyNestedObservableObject(root.user(), IssueTracker.signedInUser());
//	}
//
//})(root("IssueTracker.Users.EditUser"));