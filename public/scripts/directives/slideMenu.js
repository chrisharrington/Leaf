IssueTracker.app.directive("slideMenu", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "templates/slideMenu.html",
		transclude: true,
		scope: {
			visible: "=",
			trigger: "@"
		},
		link: function(scope, element) {
			$rootScope.$on("documentClicked", function(context, target, parents) {
				if (target.className.indexOf(scope.trigger) === -1 && !parents.exists(function(x) { return x.className.indexOf(scope.trigger) > 1; }))
					scope.$apply(function() {
						scope.visible = false;
					});
			});
		}
	};
});