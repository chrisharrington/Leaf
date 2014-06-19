(function() {
	ko.bindingHandlers.timeago = {
		update: function(element, valueAccessor) {
			$(element).text($.timeago(valueAccessor()));
		}
	}
})();