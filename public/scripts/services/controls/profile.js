IssueTracker.app.service("profile", function($rootScope, feedback) {
	var _old;

	this.visible = false;
	this.loading = false;

	this.show = function() {
		//_old = $rootScope.user.clone();

		this.visible = true;
	};

	this.ok = function() {
		if (!_validate())
			return;
	};

	this.cancel = function() {
		this.visible = false;
	};

	function _validate() {
		var error;
		if ($rootScope.user.emailAddress === "")
			error = "Your email address is required.";
		else if ($rootScope.user.name === "")
			error = "Your name is required.";
		else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($rootScope.user.emailAddress))
			error = "The email address is invalid.";

		if (error) {
			feedback.error(error);
			return false;
		}

		return true;
	}
});