
(function() {

	ko.bindingHandlers.remoteTemplate = {
		update: function(element, valueAccessor) {
			var view = valueAccessor()();
			if (!view)
				return;

			$.when(_getDataFromView(view), _hideTiles($(element))).done(function (result) {
				if (!result)
					return;

				$(element).attr("class", "content-container " + view.style).empty().append($("<div></div>").addClass("binding-container").html(result[0])).find(">div.tile").css("visibility", "hidden");
				_showTiles($(element));

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

		return url.substring(0, 1) == "#" ? new ResolvedDeferred($(url).html()) : $.get(IssueTracker.virtualDirectory() + url).fail(function () {
			IssueTracker.Feedback.error("An error occurred retrieving the view at " + url + ". Please contact technical support.");
		});
	}

	function _hideTiles(element) {
		var deferred = new $.Deferred();
		var tileDeferreds = [];

		$(element).find(">div.tile:visible").each(function() {
			var inner = new $.Deferred();
			tileDeferreds.push(inner.promise());
			$(this).fadeOut(250, function() {
				inner.resolve();
			});
		});

		$.when.apply(null, tileDeferreds).then(function() {
			deferred.resolve();
		});

		return deferred.promise();
	}

	function _showTiles(element) {
		var array = [];
		for (var i = 0; i < element.find(">div.tile").length; i++)
			array.push(i);

		array = _shuffle(array);
		for (var i = 0; i < array.length; i++) {
			var tile = element.find(">div.tile:eq(" + array[i] + ")").css("visibility", "hidden");
			(function(innerTile) {
				IssueTracker.Defer.execute(function() {
					innerTile.css("visibility", "visible").hide().fadeIn(250);
				}, 50 * (i + 1));
			})(tile);
		}
	}

	function _shuffle(array) {
		for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) ;
		return array;
	}

})();