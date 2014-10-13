IssueTracker.app.directive("modal", function($rootScope, $timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: {
			visible: "=",
			title: "@",
			loading: "=",
			ok: "=",
			cancel: "="
		},
		link: function(scope, element, attributes, control, transclude) {
			$(element).find("div.to-be-transcluded").replaceWith(transclude());
		            
			scope.customButtons = attributes.customButtons !== undefined;
			scope.customHeader = attributes.customHeader !== undefined;
			
			scope.close = function() {
				scope.visible = false;
				if (scope.cancel !== undefined)
					scope.cancel();
			};

			$rootScope.$on("escapePressed", function() {
				scope.$apply(function() {
					if (scope.visible === true) {
						scope.close();
					}
				});
			});
		}
	};
});