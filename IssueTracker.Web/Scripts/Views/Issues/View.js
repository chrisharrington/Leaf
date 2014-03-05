
(function(root) {

	var _container;
	var _observable;
	var _flipper;

	root.availableViews = ko.observableArray(["expanded", "collapsed"]);
	root.view = ko.observable(root.availableViews()[0]);

	root.init = function (container, flipper, observable) {
		_container = container;
		_observable = observable;
		_flipper = flipper;
		
		_hookupEvents();
	};

	function _hookupEvents() {
		_container.on("click", "div.modify-view-container", function () { _observable("modify-view-template"); _flipper.toggle(); });
		_container.on("click", "div.modify-view>div", function() { _flipper.toggle(); _setPriorityBarHeights(); });
	}

	function _setPriorityBarHeights() {
		_container.find("div.priority.unset").each(function () {
			var bar = $(this).removeClass("unset");
			var tile = bar.closest("a.tile");
			bar.height(tile.removeClass("hidden").height());
		});
	}

})(root("IssueTracker.Issues.View"));