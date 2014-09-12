IssueTracker.app.factory("menu", function($rootScope, once) {
	return {
		init: function() {
			once("menu-init", function() {
				$(window).on("click", function(e) {
					var target = $(e.target);
					if (target.attr("menu-trigger") !== "" && target.attr("menu") !== "" && (target.parents("[menu]").length === 0 || target.parents("menu-item").length !== 0 || target.parents("[menu-item]").length !== 0))
						$rootScope.$apply(function() {
							$rootScope.hideMenu();
						});
				});

				$(window).on("resize", _setMenuHeight);
				$(_setMenuHeight);

				function _setMenuHeight() {
					$("[menu]").height($(window).height() - 50);
				}
			});

			$rootScope.menuVisible = false;

			$rootScope.showMenu = function() {
				$rootScope.menuVisible = true;
			};

			$rootScope.hideMenu = function() {
				$rootScope.menuVisible = false;
			};
		}
	}
});