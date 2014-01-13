
(function (root) {

	var _cache = {};
	var _container;

	root.load = function (params) {
		if (!_container) {
			_container = $("div.dialog.popup");
			_container.find("i").click(function() { _container.hide(); });
		}
		
		IssueTracker.popup("");
		_setTitle(params.title);
		_container.show();
		$.when(_getHtml(params.view)).then(function (html) {
			IssueTracker.popup(html);
			_setPosition(params.anchor);
			ko.applyBindings(params.model ? params.model : IssueTracker, _container.find("div.content>div")[0]);
		});

		$(document).click(function (e) {
			if ($(e.target).closest("#" + params.trigger.attr("id")).length == 0 && $(e.target).closest("div.dialog.popup").length == 0)
				_container.hide();
		});

		return _container.find("div.content>div");
	};

	root.hide = function() {
		_container.hide();
	};
	
	function _setTitle(title) {
		var h1 = _container.find("h1");
		if (title)
			h1.text(title).show();
		else
			h1.text("").hide();
	}
	
	function _setPosition(trigger) {
		_setLeftOrRight(trigger);
		_setAboveOrBeneath(trigger);
	}
	
	function _setLeftOrRight(trigger) {
		var offset = trigger.offset();
		var isLeft = offset.left <= $(window).width() / 2;
		var arrow = _container.find("div.arrow").removeClass("left right");
		arrow.addClass(isLeft ? "left" : "right");
		_container.css("left", isLeft ? (offset.left + trigger.outerWidth()/2 - 30) : (offset.left - _container.outerWidth() + trigger.outerWidth()/2 + 30));
	}
	
	function _setAboveOrBeneath(trigger) {
		var offset = trigger.offset();
		var isBeneath = offset.top <= $(window).height() / 2;
		_container.removeClass("above beneath");
		_container.addClass(isBeneath / 2 ? "beneath" : "above");
		_container.css("top", isBeneath ? (offset.top + 47) : (offset.top - _container.height() - 49));
	}
	
	function _getHtml(location) {
		if (_cache[location])
			return new ResolvedDeferred(_cache[location]);
		return new ResolvedDeferred($(location).html());
	}

})(root("IssueTracker.Popup"));
