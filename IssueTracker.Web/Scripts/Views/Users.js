
(function (root) {

	var _container;

	root.deleteUserModel = {
		name: ko.observable(),
		email: ko.observable(),
		cancel: function() { IssueTracker.Dialog.hide(); },
		deleteUser: _deleteUser
	};

	root.editUserModel = {
		id: ko.observable(),
		firstName: ko.observable(),
		lastName: ko.observable(),
		email: ko.observable(),
		phone: ko.observable(),
		cancel: function() { IssueTracker.Dialog.hide(); },
		saveChanges: _saveChanges
	};

	root.resetPasswordModel = {
		name: ko.observable(),
		email: ko.observable(),
		cancel: function() { IssueTracker.Dialog.hide(); },
		resetPassword: _resetPassword
	};

	root.load = function(container) {
		_container = container;
	};

	root.loadDeleteUserDialog = function (obj, event) {
		var tile = $(event.currentTarget).closest("div.tile");
		root.deleteUserModel.name(tile.find("h1").text());
		root.deleteUserModel.email(tile.attr("data-user-id"));

		IssueTracker.Dialog.load("Delete User?", "#delete-user-dialog", root.deleteUserModel, $(event.currentTarget));
	};
	
	root.loadEditUserDialog = function (obj, event) {
		var tile = $(event.currentTarget).closest("div.tile");
		var name = tile.find("h1").text().split(" ");
		root.editUserModel.id(tile.attr("data-user-id"));
		root.editUserModel.firstName(name[0]);
		root.editUserModel.lastName(name[1]);
		root.editUserModel.email(tile.attr("data-user-id"));
		root.editUserModel.phone(tile.find("i.fa-phone").parent().find(">span").text());
		IssueTracker.Dialog.load("Edit User", "#edit-user-dialog", root.editUserModel, $(event.currentTarget));
	};

	root.loadResetPasswordDialog = function(obj, event) {
		var tile = $(event.currentTarget).closest("div.tile");
		root.resetPasswordModel.name(tile.find("h1").text());
		root.resetPasswordModel.email(tile.attr("data-user-id"));
		IssueTracker.Dialog.load("Reset Password?", "#reset-password-dialog", root.resetPasswordModel, $(event.currentTarget));
	};

	function _saveChanges() {
		//todo: Chris - validation
		IssueTracker.Dialog.hide();

		var model = root.editUserModel;
		var tile = _container.find("div.tile[data-user-id='" + model.id() + "']");
		tile.find("h1").text(model.firstName() + " " + model.lastName());
		tile.find("i.fa-envelope").parent().find("span").text(model.email());
		tile.find("i.fa-phone").parent().find("span").text(model.phone());

		$.post(IssueTracker.virtualDirectory() + "User/Edit", { id: model.id(), firstName: model.firstName(), lastName: model.lastName(), email: model.email(), phone: model.phone() }).error(function() {
			alert("An unexpected error has occurred while editing the user. Your changes were not saved. Please try again.");
		});
	}
	
	function _resetPassword() {
		IssueTracker.Dialog.hide();

		$.post(IssueTracker.virtualDirectory() + "User/ResetPassword", { email: root.resetPasswordModel.email() }).error(function() {
			alert("An unexpected error occurred while resetting the user's password. The user's password was not changed.");
		});
	}

	function _deleteUser() {
		IssueTracker.Dialog.hide();
		
		var tile = _container.find("div.tile[data-user-id='" + root.deleteUserModel.email() + "']");
		tile.fadeOut(250, function() { tile.remove(); });

		$.post(IssueTracker.virtualDirectory() + "User/Delete", { email: root.deleteUserModel.email() }).error(function() {
			alert("An unexpected error occurred and the user was not deleted. Please try again.");
		});
	}

	IssueTracker.Page.build({
		root: root,
		view: "User/List",
		title: "Users",
		route: "#/users",
		style: "users-container"
	});

})(root("IssueTracker.Users"));
