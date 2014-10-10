IssueTracker.app.factory("settings", function($rootScope) {
    var scope;
    return scope = {
        visible: false,

	   show: function() {
           scope.visible = true;
	   },

	   signOut: function() {
           scope.visible = false;
           $rootScope.user = null;
           $rootScope.project = null;
           window.localStorage.removeItem("session");
           window.sessionStorage.removeItem("session");
           window.location.hash = "welcome";
	   } 
    }
});