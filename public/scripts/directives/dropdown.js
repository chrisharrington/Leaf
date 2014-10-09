IssueTracker.app.directive("dropdown", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
            items: "=",
			placeholder: "@",
			ngModel: "="
		},
		link: function(scope, element, attributes) {
            if (attributes.selected !== undefined)
                scope.selected = scope.$eval(attributes.selected);
			scope.listVisible = false;
			scope.showDeleted = attributes.showDeleted !== undefined;
			
			scope.select = function(item) {
				scope.listVisible = false;
				scope.selected = item;
			};
            
            $rootScope.$on("documentClicked", function(context, target) {
                if (!$(target).hasClass("dropdown-label"))
                    scope.$apply(function() {
                        scope.listVisible = false;
                    });
            });
		}
	};
});