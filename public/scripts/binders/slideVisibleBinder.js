ko.bindingHandlers.slideVisible = {
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		$(element).transition({ height: ko.unwrap(value.bool) ? 40 : 0 }, value.speed || 250);
	}
};