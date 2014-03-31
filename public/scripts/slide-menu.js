var IssueTracker = window.IssueTracker || {};

IssueTracker.SlideMenu = function(container, trigger) {
	this.HEADER_HEIGHT = 60;
	this.ANIMATION_SPEED = 350;

	this._container = container;
	this._trigger = trigger;

	var me = this;
	trigger.on("click", function() { me.show(); });
	$(document).on("click", function (e) {
		if (!me._container.is(":hidden") && !me._wasTriggerClicked($(e.target)))
			me.hide();
	});
};

IssueTracker.SlideMenu.build = function(container, trigger) {
	return new IssueTracker.SlideMenu(container, trigger);
};

IssueTracker.SlideMenu.prototype.show = function() {
	this._container.css({ top: "-" + (this._container.outerHeight()-this.HEADER_HEIGHT+10) + "px" }).transition({ y: this._container.outerHeight() + 10 }, this.ANIMATION_SPEED, "ease");
};

IssueTracker.SlideMenu.prototype.hide = function() {
	this._container.transition({ y: 0 }, this.ANIMATION_SPEED, "ease");
};

IssueTracker.SlideMenu.prototype._wasTriggerClicked = function(context) {
	for (var i = 0; i < this._trigger.length; i++) {
		if ($(this._trigger[i]).attr("id") == context.attr("id") || context.parents().filter("#" + $(this._trigger[i]).attr("id")).length > 0)
			return true;
	}
	return false;
};