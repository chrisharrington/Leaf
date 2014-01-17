
describe("Popup", function () {
	var _container;
	var _anchor;
	var _popup;

	beforeEach(function () {
		_anchor = affix("div.anchor");
		_container = affix("div.popup.dialog");
		_container.affix("div.arrow.top.left>div");
		_container.affix("div.content['data-bind'='html: popup']");
		_container.affix("div.arrow.bottom.left>div");

		affix('script[type="text/html"][id="test-popup-template"]>div');

		IssueTracker.popup = ko.observable();

		_popup = IssueTracker.Popup;
	});

	describe("load", function () {
		it("should fail with missing anchor", function () {
			expect(function() { _popup.load(); }).toThrow(new Error("Missing popup anchor."));
		});

		it("should load and show popup", function() {
			_popup.load({ anchor: _anchor });
		});
		
		it("should load and show popup", function () {
			_popup.load({ anchor: _anchor });
		});
	});
});