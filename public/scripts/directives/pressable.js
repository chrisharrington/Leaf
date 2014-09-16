IssueTracker.app.directive("pressable", function($timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/pressable.html",
		transclude: true,
		scope: {
			text: "@"
		},
		link: function(scope, element) {
			$(element).on("click", function(e) {
				var el = $(this), button = el.find("button");
				el.addClass("active animate");

				var flash = el.find(".flash");
				flash.css({ width: button.outerWidth() + "px", left: e.offsetX - button.outerWidth()/2 });
				$timeout(function() {
					el.removeClass("animate active");
				}, IssueTracker.ANIMATION_SPEED*2);
			});
		}
	}
});