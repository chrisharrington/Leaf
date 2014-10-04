IssueTracker.app.directive("modal", function($timeout, $rootScope) {
	var _first = true;

	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: {
			show: "=",
			title: "@",
			loading: "=",
			ok: "=",
			cancel: "="
		},
		link: function(scope, element) {
			scope.$watch("show", function(value) {
				if (_first) {
					_first = false;
					return;
				}

				_toggle(value, $(element));
				$(element).find("input:first").focus();
			});

			$rootScope.$on("escapePressed", function() {
				scope.show = false;
				if (scope.cancel !== undefined)
					scope.cancel();
			});

			function _toggle(value, panel) {
				panel.toggleClass("show", value);

				var overlay = panel.find(">div.overlay"), content = panel.find(">div.content-container");
				if (!value) {
					$timeout(function () {
						overlay.css("visibility", "hidden");
					}, IssueTracker.ANIMATION_SPEED);
					content.css({
						"transform": ""
					})
				} else {
					overlay.css("visibility", "visible");
					_setPosition(content);
					content.css({
						"transform": "translate3d(0, " + (content.outerHeight()+100) + "px, 0)"
					});
				}
			}

			function _setPosition(content) {
				content.css({ top: ((content.outerHeight()+10)*-1) + "px", left: ($(window).width()/2 - content.outerWidth()/2) + "px" })
			}
		}
	};
});