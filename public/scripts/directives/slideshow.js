IssueTracker.app.directive("slideshow", function ($interval, imageLoader) {
	var imageIndex = -1, urls = [];

	return {
		restrict: "E",
		templateUrl: "templates/slideshow.html",
		scope: {
			urls: "="
		},
		link: function(scope, element) {
			element.find("div.image-container.first").on("transitionend oTransitionEnd webkitTransitionEnd", function() {
				scope.$apply(function() {
					scope.sliding = false;
					scope.swap = !scope.swap;
				});
			});

			scope.loading = true;
			scope.current = "";
			scope.sliding = false;
			scope.swap = true;

			var index = 0, urls = scope.urls;

			imageLoader.load(urls).then(function() {
				$interval(function() {
					scope.sliding = true;
					if (index > urls.length-1)
						index = 0;
				}, 5000);

				scope.loading = false;
				$(element).find("div.image-container.current").css("background-image", "url('" + urls[0] + "')");
				if (urls.length > 1)
					$(element).find("div.image-container.next").css("background-image", "url('" + urls[1] + "')");
			});
		}
	};
});
