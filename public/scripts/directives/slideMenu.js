IssueTracker.app.directive("slideMenu", function($rootScope, $timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/slideMenu.html",
		transclude: true,
		scope: {
			show: "=",
			trigger: "@",
            anchor: "@"
		},
		link: function(scope, element) {
            scope.offset = 0;
            
            scope.$watch("show", function(value) {
                $timeout(function() {
                    scope.visible = value;
                    if (value === true) {
                        _setPosition(scope);
                        
                    }
                });
            });
            
			$rootScope.$on("documentClicked", function(inner, target) {
                if (scope.visible)
					scope.$apply(function() {
						scope.visible = false;
					});
			});
            
            function _setPosition(scope) {
                $timeout(function() {
                    if (scope.trigger !== undefined)
                        scope.offset = $("." + scope.trigger).offset().left;
                    else if (scope.anchor !== undefined) {
                        if (scope.anchor === "right")
                            scope.offset = $("div.header-wrapper").offset().left + $("div.header-wrapper").outerWidth() - $(element).find(">div").outerWidth();
                        else if (scope.anchor === "left")
                            scope.offset = $("div.header-wrapper").offset().left;
                    }
                });
            }
		}
	};
});