
(function ($) {
	$.fn.fadeInDeferred = function(duration) {
		return this.each(function () {
			var deferred = new $.Deferred();
			$(this).fadeIn(duration, function () {
				deferred.resolve();
				if (callback)
					callback();
			});
			return deferred.promise();
		});
	};

	$.fn.fadeOutDeferred = function (duration) {
		var deferred = new $.Deferred();
		var promises = this.map(function() {
			var inner = new $.Deferred();
			$(this).fadeOut(duration, function() {
				inner.resolve();
			});
			return inner.promise();
		});

		$.when.apply(null, promises).then(function() {
			deferred.resolve();
		});

		return deferred.promise();
	};
	
	$.fn.slideUpDeferred = function (duration) {
		return this.each(function () {
			var deferred = new $.Deferred();
			$(this).slideUp(duration, function () {
				deferred.resolve();
				if (callback)
					callback();
			});
			return deferred.promise();
		});
	};
	
	$.fn.slideDownDeferred = function (duration) {
		return this.each(function () {
			var deferred = new $.Deferred();
			$(this).slideDown(duration, function () {
				deferred.resolve();
				if (callback)
					callback();
			});
			return deferred.promise();
		});
	};
})(jQuery);