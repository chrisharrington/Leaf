
(function(root) {

	var SLIDE_INTERVAL = 250;
	var TIMEOUT_INTERVAL = 7500;

	var _container;
	var _hideTimeout;

	(function() {
		$(document).on("click", "div.global-feedback i.fa-times", function() {
			root.clear();
		});

		$(function() {
			_container = $("div.global-feedback");
		});
	})();

	root.error = function (message) {
		_setMessage(message, "error");
	};

	root.success = function (message) {
		_setMessage(message, "success");
		_hideTimeout = setTimeout(function() {
			root.clear();
		}, TIMEOUT_INTERVAL);
	};

	root.clear = function () {
		var deferred = new $.Deferred();
		_container.slideUp(SLIDE_INTERVAL, function () {
			_container.removeClass("success error").find(">div>span").text("");
			deferred.resolve();
		});
		return deferred.promise();
	};

	function _setMessage(message, style) {
		if (_hideTimeout)
			clearTimeout(_hideTimeout);
		$.when(root.clear()).then(function () {
			_container.addClass(style).slideDown(SLIDE_INTERVAL).find(">div>span").text(message);
		});
	}

})(root("IssueTracker.Feedback"));