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
            
			scope.$watch("visible", function(value) {
				console.log("watch " + value);
				_toggle(value);
				$(element).find("input:first").focus();
			});

			$rootScope.$on("escapePressed", function() {
				scope.$apply(function() {
					if (scope.visible === true) {
						scope.visible = false;
						if (scope.cancel !== undefined)
							scope.cancel();
					}
				});
			});

			function _toggle(value) {
				$(element).toggleClass("show", value);

				var overlay = $(element).find(">div.overlay"), content = $(element).find(">div.content");
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