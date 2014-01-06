
(function (root) {

	var _cache = {};
	var _container;

	root.load = function (title, location, data, trigger) {
		if (!_container) {
			_container = $("div.dialog");
			_container.find("i").click(function() { _container.hide(); });
		}
		
		IssueTracker.dialog("");
		_container.show().find("h1").text(title);
		_setLoading(true);
		$.when(_getHtml(location)).then(function (html) {
			_setLoading(false);
			IssueTracker.dialog(html);
			_setPosition(trigger);
			if (data)
				ko.applyBindings(data, _container.find("div.content>div")[0]);
		});

		return _container;
	};

	root.hide = function() {
		_container.hide();
	};
	
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

	function _setLoading(isLoading) {
		var loadingPanel = _container.find("div.loading");
		if (isLoading)
			loadingPanel.show();
		else
			loadingPanel.hide();
	}
	
	function _getHtml(location) {
		if (_cache[location])
			return new ResolvedDeferred(_cache[location]);
		if (location.substring(0, 1) == "#")
			return new ResolvedDeferred($(location).html());
		return _getRemoteHtml(location);
	}

	function _getRemoteHtml(url) {
		return $.get(IssueTracker.virtualDirectory() + url).success(function (html) {
			_cache[url] = html;
		}).error(function() {
			alert("An error has occurred while retrieving the dialog html.");
		});
	}

})(root("IssueTracker.Dialog"));
