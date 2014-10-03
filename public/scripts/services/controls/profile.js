IssueTracker.app.service("profile", function($rootScope, feedback) {
	this.visible = false;
	this.loading = false;

	this.show = function() {
		this.visible = true;
	};

	this.ok = function() {
		if (!_validate())
			return;
	};

	this.cancel = function() {

	};

	function _validate() {
		if ($rootScope.user.name === "") {
			feedback.error("Your name is required.");
			return false;
		}

		if ($rootScope.user.emailAddress === "") {
			feedback.error("Your email address is required.");
			return false;
		}

		if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($rootScope.user.emailAddress)) {
			feedback.error("The email address is invalid.");
			return false;
		}
	}
});