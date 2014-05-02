var IssueTracker = window.IssueTracker || {};

IssueTracker.SlideMenu = function(container) {
	this.HEADER_HEIGHT = 60;
	this.ANIMATION_SPEED = 350;

	this._container = container;

	var me = this;
	$(document).on("click", function () {
		if (me._container.is(":visible"))
			me.hide();
	});
};

IssueTracker.SlideMenu.build = function(container) {
	return new IssueTracker.SlideMenu(container);
};

IssueTracker.SlideMenu.prototype.show = function() {
	var me = this;
	setTimeout(function() {
		var contentContainer = $(".content-container");
		me._container.show().css({
			top: "-" + (me._container.outerHeight() - me.HEADER_HEIGHT + 10) + "px",
			left: (contentContainer.outerWidth() + contentContainer.position().left - me._container.outerWidth()) + "px"
		}).transition({ y: me._container.outerHeight() + 10 }, me.ANIMATION_SPEED, "ease");
	}, 5);
};

IssueTracker.SlideMenu.prototype.hide = function() {
	var me = this;
	this._container.transition({ y: 0 }, this.ANIMATION_SPEED, "ease", function() {
		me._container.hide();
	});
};