IssueTracker.app.factory("profile", function($rootScope, feedback, userRepository) {
    var scope;
    return scope = {
        visible: false,
        loading: false,
        
        show: function() {
            scope.visible = true;
        },
        
        ok: function() {
            if (!_validate())
                return;

            scope.loading = true;
            userRepository.profile($rootScope.user).then(function() {
                feedback.success("Your profile has been updated.");
                scope.cancel();
                _updateUserInArray();
                _updateUserInSession();
            }).catch(function() {
                feedback.error("An error has occurred while updating your profile. Please try again later.");
            }).finally(function() {
                scope.loading = false;
            });
        },
        
        cancel: function() {
            scope.visible = false;
        }
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
		
		return true;
	}
    
    function _updateUserInArray() {
        var user = $rootScope.users.dict("id")[$rootScope.user.id];
        for (var name in $rootScope.user)
            if (name !== "id")
                user[name] = $rootScope.user[name];
        $rootScope.$broadcast("userChanged", user);
    }
	
	function _updateUserInSession() {
		var session = window.sessionStorage.getItem("session");
		var isSession = true;
		if (!session) {
			session = window.localStorage.getItem("session");
			isSession = false;
		}
		if (!session)
			return;
		
		session = JSON.parse(session);
		session.user = $rootScope.user;
		
		(isSession ? window.sessionStorage : window.localStorage).setItem("session", JSON.stringify(session));
	}
});