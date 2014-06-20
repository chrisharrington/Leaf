ko.bindingHandlers.animateVisible = {
	init: function(element, valueAccessor) {
		var value = valueAccessor();
		switch (value.animation) {
			case "slide":
				$(element).height(ko.unwrap(value.bool) ? $(element).height() : 0).toggle(ko.unwrap(value.bool));
				break;
			case "fade":
				$(element).css("opacity", ko.unwrap(value.bool) ? $(element).css("opacity") : 0).toggle(ko.unwrap(value.bool));
				break;
		}
	},

	update: function(element, valueAccessor) {
		var value = valueAccessor();
		var bool = ko.unwrap(value.bool);
		switch (value.animation) {
			case "slide":
				if (bool)
					$(element).show();
				$(element).transition({ height: ko.unwrap(value.bool) ? value.height || "auto" : "0px" }, value.speed || 250, function() {
					if (!bool)
						$(element).hide();
				});
				break;
			case "fade":
				$(element).toggle(ko.unwrap(value.bool)).transition({ opacity: ko.unwrap(value.bool) ? value.opacity || 100 : 0 }, value.speed || 250);
				break;
		}
	}
};