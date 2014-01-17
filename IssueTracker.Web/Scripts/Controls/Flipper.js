
namespace("IssueTracker.Controls");

IssueTracker.Controls.Flipper = function (view, userAgent) {
	if (!userAgent)
		userAgent = navigator.userAgent;
	if (!view || view.length == 0)
		throw new Error("Missing view for flipper.");

	this._view = view;
	this._isIE = userAgent.match(/msie/i) || ((/Trident\/7\./).test(userAgent));
};

IssueTracker.Controls.Flipper.create = function(view, userAgent) {
	return new IssueTracker.Controls.Flipper(view, userAgent);
};

IssueTracker.Controls.Flipper.prototype.toggle = function() {
	if (this._isIE)
		this._toggleForIE();
	else
		this._view.toggleClass("flipped");
};

IssueTracker.Controls.Flipper.prototype._toggleForIE = function() {
	this._view.removeClass("transition");
	var front = this._view.find(".front");
	var back = this._view.find(".back");
	if (front.hasClass("shown") || (!front.hasClass("shown") && !back.hasClass("shown")))
		this._switch(front, back);
	else
		this._switch(back, front);
};

IssueTracker.Controls.Flipper.prototype._switch = function(first, second) {
	first.removeClass("shown").fadeOut(200);
	second.addClass("shown").fadeIn(200);
};