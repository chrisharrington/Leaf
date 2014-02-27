
namespace("IssueTracker.Controls");

IssueTracker.Controls.Flipper = function (selector, userAgent) {
	if (!userAgent)
		userAgent = navigator.userAgent;
	if (!selector)
		throw new Error("Missing selector for flipper.");

	this._selector = selector;
	this._isIE = userAgent.match(/msie/i) || ((/Trident\/7\./).test(userAgent));
};

IssueTracker.Controls.Flipper.create = function(view, userAgent) {
	return new IssueTracker.Controls.Flipper(view, userAgent);
};

IssueTracker.Controls.Flipper.prototype.toggle = function() {
	if (this._isIE)
		this._toggleForIE();
	else
		$(this._selector).toggleClass("flipped");
};

IssueTracker.Controls.Flipper.prototype._toggleForIE = function () {
	var view = $(this._selector);
	view.removeClass("transition");
	var front = view.find(".front");
	var back = view.find(".back");
	if (front.hasClass("shown") || (!front.hasClass("shown") && !back.hasClass("shown")))
		this._switch(front, back);
	else
		this._switch(back, front);
};

IssueTracker.Controls.Flipper.prototype._switch = function(first, second) {
	first.removeClass("shown").fadeOut(200);
	second.addClass("shown").fadeIn(200);
};