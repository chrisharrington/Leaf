IssueTracker.app.directive("autocomplete", function() {
	var _first = true;
	var _selected = true;

	return {
		restrict: "E",
		templateUrl: "templates/autocomplete.html",
		scope: {
			placeholder: "@",
			get: "=",
			value: "=",
			tabindex: "@tab",
			ngModel: "="
		},
		link: function(scope, element) {
			if (_first) {
				window.addEventListener("resize", function() {
					scope.$apply(function() {
						scope.containerWidth = $(element).width();
					});
				});
			}

			_first = false;
			scope.visible = true;
			scope.containerWidth = $(element).width();

			scope.select = function(result) {
				scope.ngModel = scope.text = result.name;
				scope.visible = false;
				_selected = true;
			};

			scope.$watch("text", function(value) {
				var localSelected = _selected;
				_selected = false;
				if (localSelected)
					return;

				if (value == "") {
					scope.visible = false;
					scope.results = [];
				} else {
					scope.get(value).then(function (results) {
						scope.visible = results.length > 0;
						scope.results = results;
					});
				}
			});
		}
	}
});