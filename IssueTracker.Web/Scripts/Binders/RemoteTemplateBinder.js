
(function () {

	var _404;

	ko.bindingHandlers.remoteTemplate = {
		init: function() {
			_404 = $("div.error404");
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
			}).fail(function(response) {
				if (response.status == 404) {
					_404.show();
					$(element).hide();
				}
			});
		}
	};

	function _getDataFromView(view) {
		var url = view.url;
		if (url instanceof Function)
			url = url();

		return $.get(IssueTracker.virtualDirectory() + url).fail(function (response) {
			if (response.status != 404)
				IssueTracker.Feedback.error("An error occurred retrieving the view at " + url + ". Please contact technical support.");
		});
	}

})();