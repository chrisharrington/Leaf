IssueTracker.app.directive("modal", function($timeout) {
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
		link: function(scope, element) {
			scope.$watch("visible", function(value) {
				_toggle(value);
				$(element).find("input:first").focus();
			});

			$(window).on("keyup", function(e) {
				if (e.keyCode === 27)
					scope.$apply(function() {
						scope.visible = false;
						if (scope.cancel !== undefined)
							scope.cancel();
					});
			});

			function _toggle(value) {
				$(element).toggleClass("show", value);

				var overlay = $(element).find(">div.overlay"), content = $(element).find(">div.content-container");
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