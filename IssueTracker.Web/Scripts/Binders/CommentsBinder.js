
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
			for (var i = 0; i < comments.length; i++) {
				element.append(html);
				ko.applyBindings(comments[i], element.find(">div:last")[0]);
			}
		}
	};

})();