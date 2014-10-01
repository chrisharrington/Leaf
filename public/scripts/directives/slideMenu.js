IssueTracker.app.directive("slideMenu", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "templates/slideMenu.html",
		transclude: true,
		scope: {
			visible: "=show",
			trigger: "@"
		},
		link: function(scope, element) {
			$rootScope.$on("documentClicked", function(inner, target) {
				if (!target.hasClass(scope.trigger) && target.parents("." + scope.trigger).length === 0 && target.parents("slide-menu").length === 0)
					scope.$apply(function() {
						scope.visible = false;
					});
			});

			scope.$watch("visible", function(value) {
				if (!value)
					return;

				$(element).find(">div").css({ left: ($("div.actions>span.anchor").offset().left - parseInt($(element).find(">div").css("width").replace("px", ""))) + "px" });
			});
		}
	};
});