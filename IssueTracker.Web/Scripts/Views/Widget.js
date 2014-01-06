
(function (root) {

	var _previewId = "#preview-panel";

	root.html = ko.observable("");
	root.css = ko.observable("");
	root.formattedHtml = ko.computed(function () {
		_applyCssToPreview();
		return root.html();
	}, root);

	root.load = function() {
		_getCode();
	};

	root.updateCode = function() {
		$.post(IssueTracker.virtualDirectory() + "Widget/Code", { html: root.html(), css: root.css() }).error(function() {
			alert("An error occurred while saving your HTML. Please try again.");
		});
	};

	function _getCss() {
		return $.get(IssueTracker.virtualDirectory() + "Widget/Css").success(function(css) {
			root.css(css);
		}).error(function() {
			alert("An error occurred while retrieving CSS. Please contact technical support.");
		});
	}
	
	function _getCode() {
		return $.get(IssueTracker.virtualDirectory() + "Widget/Code").success(function(data) {
			root.html(data.Html);
			root.css(data.Css);
		}).error(function() {
			alert("An error occurred while retrieving HTML. Please contact technical support.");
		});
	}

	function _applyCssToPreview() {
		var formattedCss = _appendPreviewIdToCssStatements(root.css());
		_appendFormattedCssToHead(formattedCss);
	}
	
	function _appendPreviewIdToCssStatements(css) {
		var statements = [];
		$.each(css.split("\n"), function() {
			statements.push(_previewId + " " + this);
		});
		return statements.join("\n");
	}
	
	function _appendFormattedCssToHead(css) {
		var style = $("#preview-style");
		if (style.length == 0) {
			style = $("<style></style>").attr("id", "preview-style").attr("type", "text/css");
			$("head").append(style);
		}

		style.text(css);
	}

	IssueTracker.Page.build({
		root: root,
		view: "Widget",
		title: "Manage Widget",
		route: "#/widget",
		style: "widget-container"
	});

})(root("IssueTracker.Widget"));
