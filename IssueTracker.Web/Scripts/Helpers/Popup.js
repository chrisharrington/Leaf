
(function (root) {

	var _container;
	var _position = IssueTracker.Position;

	root.load = function (params) {
		if (!params || !params.anchor)
			throw new Error("Missing popup anchor.");
		if (!params.anchor.attr("id"))
			throw new Error("Missing popup anchor ID.");
		if (!params.view)
			throw new Error("Missing popup view.");
		if (!params.container)
			params.container = $("div.dialog.popup");

		_container = params.container;

		if (!params.trigger)
			params.trigger = params.anchor;

		IssueTracker.popup("");
		_container.show();
		$.when(_getHtml(params.view)).then(function (html) {
			IssueTracker.popup(html);
			_setPosition(params.anchor, params.verticalOffset);
			ko.cleanNode(_container.find("div.content>div")[0]);
			ko.applyBindings(params.model ? params.model : IssueTracker, _container.find("div.content>div")[0]);
		});

		$(document).off("click").on("click", function (e) {
			if ($(e.target).closest("#" + params.trigger.attr("id")).length == 0 && $(e.target).closest("div.dialog.popup").length == 0)
				_container.hide();
		});

		return _container.find("div.content>div");
	};

	root.hide = function() {
		_container.hide();
	};
	
	function _setPosition(trigger, verticalOffset) {
		_setLeftOrRight(trigger);
		_setAboveOrBeneath(trigger, verticalOffset);
	}
	
	function _setLeftOrRight(trigger) {
		var offset = trigger.offset();
		var isLeft = _position.isElementLeftHalfOfWindow(trigger);
		var arrow = _container.find("div.arrow").removeClass("left right");
		arrow.addClass(isLeft ? "left" : "right");
		_container.css("left", isLeft ? (offset.left + trigger.outerWidth()/2 - 30) : (offset.left - _container.outerWidth() + trigger.outerWidth()/2 + 30));
	}
	
	function _setAboveOrBeneath(trigger, verticalOffset) {
		var offset = trigger.offset();
		var isBeneath = _position.isElementTopHalfOfWindow(trigger);
		_container.removeClass("above beneath");
		_container.addClass(isBeneath / 2 ? "beneath" : "above");
		var top = isBeneath ? (offset.top + 47) : (offset.top - _container.height() - 49);
		if (verticalOffset)
			top += verticalOffset;
		_container.css("top", top);
	}
	
	function _getHtml(location) {
		return new ResolvedDeferred($(location).html());
	}

})(root("IssueTracker.Popup"));
