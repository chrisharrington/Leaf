
(function () {

	ko.bindingHandlers.remoteTemplate = {
		update: function(element, valueAccessor) {
			var view = valueAccessor()();
			if (!view)
				return;

			$.when(_getDataFromView(view)).then(function (result) {
				if (!result)
					return;

				$(element).attr("class", "content-container " + view.style).empty().append($("<div></div>").addClass("binding-container").html(result));

				ko.cleanNode($(element).find(">div.binding-container")[0]);
				ko.applyBindings(view.data, $(element).find(">div.binding-container")[0]);

				if (view.load)
					view.load();
			});
		}
	};

	function _getDataFromView(view) {
		var url = view.url;
		if (url instanceof Function)
			url = url();

		return $.get(IssueTracker.virtualDirectory() + url).fail(function () {
			IssueTracker.Feedback.error("An error occurred retrieving the view at " + url + ". Please contact technical support.");
		});
	}

})();