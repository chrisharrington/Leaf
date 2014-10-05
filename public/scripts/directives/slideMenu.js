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
			$rootScope.$on("documentClicked", function(inner, target) {
				if (!target.hasClass(scope.trigger) && target.parents("." + scope.trigger).length === 0 && target.parents("slide-menu").length === 0)
					scope.$apply(function() {
						scope.visible = false;
					});
			});
		}
	};
});