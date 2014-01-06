
(function () {

	ko.bindingHandlers.slideVisible = {
		update: function(element, valueAccessor) {
			if (ko.utils.unwrapObservable(valueAccessor())) {
				$(element).hide().removeClass("hidden").slideDown(250);
			} else {
				$(element).slideUp(250);
			}
		}
	};

})();