ko.bindingHandlers.slideVisible = {
	init: function(element, valueAccessor) {
		var value = valueAccessor();
		$(element).toggle(ko.unwrap(value.bool));
	},
	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var speed = value.speed || 250;
		if (ko.unwrap(value.bool))
			$(element).height(0).css("overflow", "hidden").show().velocity({ height: value.height }, speed);
		else
			$(element).velocity({ height: 0 }, speed);
	}
};