IssueTracker.app.directive("tooltip", function() {
	var _view;

	return {
		restrict: "A",
		scope: {
			text: "@tooltip",
			alignment: "@tooltipAlignment"
		},
		link: function(scope, element) {
			$(element).on("mouseenter", function() {
				_show($(element), {
					text: scope.text,
					alignment: scope.alignment || "centre",
					vbuffer: 0
				});
			}).on("mouseleave", function() {
				_view.hide();
			});
		}
	};

	function _show(element, params) {
		if (!_view)
			_view = $("#tooltip-container");

		_setArrowLocation(params.alignment);
		_view.find("span").text(params.text);
		_view.show();
		_setPosition(element, params);
	}

	function _setArrowLocation(alignment) {
		_view.removeClass("left right");
		if (alignment === "center")
			return;

		_view.addClass(alignment);
	}

	function _setPosition(element, params) {
		_view.css({ top: (element.offset().top + element.outerHeight() + 10 + params.vbuffer) + "px" });
		switch (params.alignment) {
			case "left":
				_view.css({ left: (element.offset().left + element.outerWidth()/2 - 15) + "px" });
				break;
			case "centre":
				_view.css({ left: (element.offset().left - _view.outerWidth()/2 + element.outerWidth()/2) + "px" });
				break;
			case "right":
				_view.css({ left: (element.offset().left - _view.outerWidth() + element.outerWidth()/2 + 15) + "px" });
				break;
		}
	}
});