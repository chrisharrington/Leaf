
(function (root) {

	root.email = ko.observable();
	root.password = ko.observable();
	root.staySignedIn = ko.observable();
	root.error = ko.observable("");
	root.signingIn = ko.observable(false);

	root.isNotVerification = ko.observable(true);
	
	root.isErrorSet = ko.computed(function () {
		return root.error() != "";
	}, root);

	root.registerEmail = ko.observable();
	root.registerPassword = ko.observable();
	root.registerConfirmPassword = ko.observable();
	root.registerError = ko.observable("");
	
	root.isRegisterErrorSet = ko.computed(function () {
		return root.registerError() != "";
	}, root);

	root.load = function (container, routeArguments) {
		var email = routeArguments["email-address"];
		if (email) {
			root.email(email);
			$("[name='password']").focus();
			root.isNotVerification(false);
			_verify(email, routeArguments["code"]);
		} else
			$("[name='email-address']").focus();
	};

	root.signIn = function () {
		var email = root.email();
		var password = root.password();

		var error = _validate(email, password);
		if (error) {
			root.error(error);
			return;
		}

		root.signingIn(true);
		$.post(IssueTracker.virtualDirectory() + "User/Login", { email: email, password: password }).success(function (result) {
			IssueTracker.isUnauthorized(false);
			IssueTracker.user(result.user);
			IssueTracker.merchantConfiguration(result.merchantConfiguration);
			IssueTracker.Dashboard.navigate();
		}).error(function() {
			root.error("Invalid credentials.");
		}).complete(function() {
			root.signingIn(false);
		});
	};

	root.register = function () {
		var firstName = root.registerFirstName();
		var lastName = root.registerLastName();
		var email = root.registerEmail();
		var phone = root.registerPhone();
		var password = root.registerPassword();
		var confirmPassword = root.registerConfirmPassword();

		var error = _validateRegistration(email, password, confirmPassword, phone, firstName, lastName);
		root.registrationError(error);
		if (error)
			return;
		
		$.post(IssueTracker.virtualDirectory() + "User/Register", { email: email, password: password, firstName: firstName, lastName: lastName, phone: phone }).success(function (user) {
			IssueTracker.user(user);
			IssueTracker.Dashboard.navigate();
		}).error(function () {
			root.error("An error has occurred during registration. Please try again.");
		});
	};

	function _verify(email, code) {
		var container = $("div.verification");
		$.post(IssueTracker.virtualDirectory() + "Verification/Verify", { email: email, verificationCode: code }).success(function() {
			container.find("div.verifying").fadeOut(250, function () {
				container.find("div.verified.success").fadeIn(250);
			});
		}).error(function () {
			container.find("div.verifying").fadeOut(250, function() {
				container.find("div.verified.failed").fadeIn(250);
			});
		});
	}

	function _validate(email, password) {
		if (!email)
			return "The email address is required.";
		if (!password)
			return "The password is required.";
		return undefined;
	}
	
	function _validateRegistration(email, password, confirmPassword) {
		if (!email)
			return "The email address is required.";
		if (!password)
			return "The password is required.";
		if (password != confirmPassword)
			return "The password and confirmed password must match.";
		return undefined;
	}

	IssueTracker.Page.build({
		root: root,
		view: "Welcome",
		title: "Welcome",
		route: ["#/welcome", "#/verify/:email-address/:code"],
		style: "welcome-container",
		isAnonymous: true
});

})(root("IssueTracker.Welcome"));
