
(function () {

	ko.bindingHandlers.fadeVisible = {
		update: function(element, valueAccessor) {
			if (ko.utils.unwrapObservable(valueAccessor())) {
				$(element).hide().removeClass("hidden").fadeIn(250);
			} else {
				$(element).fadeOut(250);
			}
		}
	};

})();