
(function (root) {

	var _container;
	var _overlay;

	root.load = function (templateId, data) {
		var params;
		if (typeof(templateId) == "string")
			params = { templateId: templateId, data: data };
		else
			params = templateId;
		_validateParams(params);

		var html = _getHtml(params.templateId);
		IssueTracker.dialog(html);

		_container = params.containerSelector ? $(params.containerSelector) : $("div.dialog");
		_overlay = params.overlaySelector ? $(params.overlaySelector) : $("div.overlay");

		ko.cleanNode(_container.find(">div")[0]);
		ko.applyBindings(params.data ? params.data : IssueTracker, _container.find(">div")[0]);

		_setPositionAndShow(_container);
		_overlay.show();

		return _container;
	};

	root.hide = function() {
		if (!_container)
			return;

		_container.hide();
		_overlay.hide();
		IssueTracker.dialog("");
	};
	
	function _validateParams(params) {
		if (!params)
			throw new Error("Missing params for dialog.");
		if (!params.templateId)
			throw new Error("Missing template ID parameter for dialog.");
	}

	function _getHtml(templateId) {
		if (!templateId.startsWith("#"))
			templateId = "#" + templateId;
		var template = $(templateId);
		if (template.length == 0)
			throw new Error("Template with ID \"" + templateId + "\" not found.");

		return template.html();
	}

	function _setPositionAndShow(container) {
		container.show().css({ "left": $(window).outerWidth() / 2 - container.outerWidth() / 2, "top": $(window).outerHeight() / 5 });
	}

})(root("IssueTracker.Dialog"));
