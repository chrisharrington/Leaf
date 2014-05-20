ko.bindingHandlers.animateVisible = {
	init: function(element, valueAccessor) {
		var value = valueAccessor();
		switch (value.animation) {
			case "slide":
				$(element).height(ko.unwrap(value.bool) ? $(element).height() : 0);
				break;
			case "fade":
				$(element).css("opacity", ko.unwrap(value.bool) ? $(element).css("opacity") : 0);
				break;
		}
	},

	update: function(element, valueAccessor) {
		var value = valueAccessor();
		switch (value.animation) {
			case "slide":
				$(element).transition({ height: ko.unwrap(value.bool) ? value.height || 40 : 0 }, value.speed || 250);
				break;
			case "fade":
				$(element).transition({ opacity: ko.unwrap(value.bool) ? value.opacity || 100 : 0 }, value.speed || 250);
				break;
		}
	}
};