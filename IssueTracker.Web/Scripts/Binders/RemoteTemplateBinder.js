
(function () {

	var _404;
	var _500;

	ko.bindingHandlers.remoteTemplate = {
		init: function() {
			_404 = $("div.error404");
			_500 = $("div.error500");
		},
		update: function(element, valueAccessor) {
			var view = valueAccessor()();
			if (!view)
				return;

			$.when(_getDataFromView(view)).done(function (result) {
				_404.hide();
				$(element).show();

				if (!result)
					return;

				$(element).attr("class", "content-container " + view.style).empty().append($("<div></div>").addClass("binding-container").html(result));

				ko.applyBindings(view.data, $(element).find(">div.binding-container")[0]);

				if (view.load)
					view.load();
			}).fail(function (response) {
				$(element).hide();
				if (response.status == 404)
					_404.show();
				else if (response.status == 500)
					_500.show();
			});
		}
	};

	function _getDataFromView(view) {
		var url = view.url;
		if (url instanceof Function)
			url = url();

		return $.get(IssueTracker.virtualDirectory() + url);
	}

})();