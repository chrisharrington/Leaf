
describe("Popup", function () {
	var _container;
	var _anchor;
	var _popup;

	beforeEach(function () {
		_anchor = affix('div.anchor[id="the-anchor"]');
		_container = affix("div.popup.dialog");
		_container.affix("div.arrow.top.left>div");
		_container.affix('div.content[data-bind="html: popup"]');
		_container.affix("div.arrow.bottom.left>div");

		affix('script[type="text/html"][id="test-popup-template"]>div.boogity.' + guid());

		IssueTracker.popup = ko.observable();

		_popup = IssueTracker.Popup;

		ko.applyBindings(IssueTracker, _container[0]);
	});

	describe("load", function () {
		it("should fail with missing anchor", function () {
			expect(function() { _popup.load(); }).toThrow(new Error("Missing popup anchor."));
		});

		it("should fail with missing ancrho ID", function() {
			expect(function() { _popup.load({ anchor: $("<div></div>") }); }).toThrow(new Error("Missing popup anchor ID."));
		});

		it("should fail with missing view", function() {
			expect(function() { _popup.load({ anchor: _anchor }); }).toThrow(new Error("Missing popup view."));
		});

		it("should load and show popup", function () {
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container).toHaveCss({ display: "block" });
		});

		it("should load popup content with content of specified view", function () {
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container.find("div.content>div")).toHaveClass("boogity");
		});

		it("should set popup position as top and left when appropriate", function () {
			spyOn(IssueTracker.Position, "isElementLeftHalfOfWindow").andReturn(true);
			spyOn(IssueTracker.Position, "isElementTopHalfOfWindow").andReturn(true);
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container.find("div.arrow")).toHaveClass("left");
			expect(_container.find("div.arrow")).toHaveClass("top");
		});

		it("should set popup position as top and right when appropriate", function () {
			spyOn(IssueTracker.Position, "isElementLeftHalfOfWindow").andReturn(false);
			spyOn(IssueTracker.Position, "isElementTopHalfOfWindow").andReturn(true);
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container.find("div.arrow")).toHaveClass("right");
			expect(_container.find("div.arrow")).toHaveClass("top");
		});

		it("should set popup position as bottom and left when appropriate", function () {
			spyOn(IssueTracker.Position, "isElementLeftHalfOfWindow").andReturn(true);
			spyOn(IssueTracker.Position, "isElementTopHalfOfWindow").andReturn(false);
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container.find("div.arrow")).toHaveClass("left");
			expect(_container.find("div.arrow")).toHaveClass("bottom");
		});

		it("should set popup position as top and right when appropriate", function () {
			spyOn(IssueTracker.Position, "isElementLeftHalfOfWindow").andReturn(false);
			spyOn(IssueTracker.Position, "isElementTopHalfOfWindow").andReturn(false);
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			expect(_container.find("div.arrow")).toHaveClass("right");
			expect(_container.find("div.arrow")).toHaveClass("bottom");
		});

		it("should hide container when non-popup or trigger element clicked", function() {
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			$("div.alert").click();
			expect(_container).toHaveCss({ display: "none" });
		});

		it("should not hide container when popup element clicked", function() {
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			_container.click();
			expect(_container).not.toHaveCss({ display: "none" });
		});

		it("should not hide container when trigger clicked", function () {
			_popup.load({ anchor: _anchor, view: "#test-popup-template" });
			_anchor.click();
			expect(_container).not.toHaveCss({ display: "none" });
		});
	});
});
