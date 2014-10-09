IssueTracker.app.factory("scopeExtensions", function($rootScope) {
	return {
		init: function(scope) {
			scope = scope || $rootScope;
			scope.$onMany = function(events, fn) {
				for(var i = 0; i < events.length; i++)
					scope.$on(events[i], fn);
			};
		}
	}
});