
(function(root) {

	var _key = "View.view";

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

		var restored = $.jStorage.get(_key);
		if (restored)
			root.view(restored);
	};

	function _hookupEvents() {
		_container.on("click", "div.modify-view-container", function () { _observable("modify-view-template"); _flipper.toggle(); });
		_container.on("click", "div.modify-view>div", function() { _flipper.toggle(); $.jStorage.set(_key, root.view()); });
	}

})(root("IssueTracker.Issues.View"));