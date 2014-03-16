
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

IssueTracker.Controls.Flipper.prototype.toggle = function(show) {
	if (this._isIE)
		this._toggleForIE(show);
	else if (typeof show == "undefined")
		$(this._selector).toggleClass("flipped");
	else if (show === true)
		$(this._selector).addClass("flipped");
	else if (show === false)
		$(this._selector).removeClass("flipped");
};

IssueTracker.Controls.Flipper.prototype._toggleForIE = function (show) {
	var view = $(this._selector);
	view.removeClass("transition");
	var front = view.find(".front");
	var back = view.find(".back");
	if (show && show === true && front.hasClass("shown"))
		return;
	if (typeof show != "undefined" && show === false && !front.hasClass("shown")) {
		this._switch(back, front);
		return;
	}
		
	if (front.hasClass("shown") || (!front.hasClass("shown") && !back.hasClass("shown")))
		this._switch(front, back);
	else
		this._switch(back, front);
};

IssueTracker.Controls.Flipper.prototype._switch = function(first, second) {
	first.removeClass("shown").fadeOut(200);
	second.addClass("shown").fadeIn(200);
};