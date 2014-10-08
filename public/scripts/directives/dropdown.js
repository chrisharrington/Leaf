IssueTracker.app.directive("dropdown", function() {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			selected: "=",
			items: "=",
			placeholder: "@",
			ngModel: "="
		},
		link: function(scope, element, attributes) {
			scope.listVisible = false;
			scope.selected = scope.selected || {};
			scope.showDeleted = attributes.showDeleted !== undefined;
			
			scope.select = function(item) {
				scope.listVisible = false;
				scope.selected = item;
			}
		}
	};
});