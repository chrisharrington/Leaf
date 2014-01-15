
namespace("IssueTracker.Controls");

IssueTracker.Controls.Flipper = function(view) {
	if (!view)
		throw new Error("Missing view for flipper.");

	this._view = view;
};

IssueTracker.Controls.Flipper.prototype.toggle = function() {
	if (navigator.userAgent.match(/msie/i) || ((/Trident\/7\./).test(navigator.userAgent))) {
		this._view.removeClass("transition");
		var front = this._view.find(".front");
		var back = this._view.find(".back");
		if (front.hasClass("shown") || (!front.hasClass("shown") && !back.hasClass("shown"))) {
			front.removeClass("shown").fadeOut(200);
			back.addClass("shown").fadeIn(200);
		} else {
			back.removeClass("shown").fadeOut(200);
			front.addClass("shown").fadeIn(200);
		}
	}
	else
		this._view.toggleClass("flipped");
}