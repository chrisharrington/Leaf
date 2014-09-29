IssueTracker.app.factory("feedback", function($rootScope) {
	var that;

	$rootScope.hideFeedback = function() {
		that.hide();
	};

	return that = {
		error: function(message) {
			$rootScope.feedbackVisible = true;
			$rootScope.feedbackSuccess = false;
			$rootScope.feedbackError = true;
			$rootScope.feedbackText = message;
		},

		success: function(message) {
			$rootScope.feedbackVisible = true;
			$rootScope.feedbackSuccess = true;
			$rootScope.feedbackError = false;
			$rootScope.feedbackText = message;
		},

		hide: function() {
			$rootScope.feedbackVisible = false;
		}
	}
});

IssueTracker.app.directive("feedback", function($rootScope) {
	$rootScope.feedbackText = "";

	return {
		restrict: "E",
		templateUrl: "templates/feedback.html",
		link: function(scope) {
			scope.text = $rootScope.feedbackText;

			scope.close = function() {
				$rootScope.feedbackText = "";
			};

			$rootScope.$watch("feedbackText", function(value) {
				if (value != "")
					scope.text = value;
				scope.visible = value && value != "";
			});
		}
	};
});