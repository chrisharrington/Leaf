
(function () {

	ko.bindingHandlers.comments = {
		init: function(element, valueAccessor) {
			
		},
		update: function (element, valueAccessor) {
			var params = valueAccessor();
			var comments = params.list();
			var html = $("#" + params.template).html();
			if (comments.length == 0)
				return;

			element = $(element);
			var difference = comments.length - element.find(">div").length;
			if (difference > 1) {
				element.empty();
				for (var i = 0; i < comments.length; i++) {
					element.append(html);
					ko.applyBindings(comments[i], element.find(">div:last")[0]);
				}
			} else if (difference == 1) {
				element.prepend(html);
				var added = element.find(">div:first");
				ko.applyBindings(comments[comments.length - 1], added[0]);
				added.hide().fadeIn(200);
			}
		}
	};

})();