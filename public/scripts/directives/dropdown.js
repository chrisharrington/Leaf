IssueTracker.app.directive("dropdown", function() {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			selected: "=",
			items: "=",
			ngModel: "="
		},
		link: function(scope, element, attributes) {
			
		}
	};
});