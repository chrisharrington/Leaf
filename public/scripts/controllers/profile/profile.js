IssueTracker.app.controller("profile", function($scope, authentication, profile, once) {
	once("profile", function() { profile.init($scope); });
	profile.load($scope);
});

IssueTracker.app.factory("profile", function($rootScope, feedback) {
	return {
		init: function(scope) {

		},

		load: function(scope) {

		}
	};

});