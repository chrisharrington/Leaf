IssueTracker.app.directive("dropdown", function($rootScope, $timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
            items: "=",
			placeholder: "@",
			selected: "="
		},
		link: function(scope, element, attributes) {
			scope.listVisible = false;
			scope.showDeleted = attributes.showDeleted !== undefined;
            scope.clicked = false;
			
			scope.select = function(item) {
				scope.listVisible = false;
				scope.selected = item;
			};
			
			scope.showList = function() {
				$timeout(function() {
					scope.listVisible = true;	
				});
			};
            
            $rootScope.$onMany(["documentClicked", "escapePressed"], function(context, target) {
                if (scope.listVisible)
                    scope.$apply(function() {
                        scope.listVisible = false;
                    });
            });
		}
	};
});