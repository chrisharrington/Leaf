var IssueTracker = window.IssueTracker || {};

IssueTracker.SlideMenu = function(container, trigger) {
	this.HEADER_HEIGHT = 60;
	this.ANIMATION_SPEED = 350;

	this._container = container;
	this._trigger = trigger;
};

IssueTracker.SlideMenu.prototype.show = function() {
	this._container.css({ top: "-" + (this._container.outerHeight()-this.HEADER_HEIGHT+10) + "px" }).transition({ y: this._container.outerHeight() + 10 }, this.ANIMATION_SPEED, "ease");
};

IssueTracker.SlideMenu.prototype.hide = function() {
	this._container.transition({ y: 0 }, this.ANIMATION_SPEED, "ease");
};