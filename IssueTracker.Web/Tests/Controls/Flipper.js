
describe("Flipper", function () {
	var _flipper;
	var _view;
	var _chrome = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36";
	var _ie8 = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)";
	var _ie9 = "Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))";
	var _ie10 = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)";

	beforeEach(function () {
		_view = affix("div.flipper");
		_view.affix("div.front");
		_view.affix("div.back");
	});

	describe("on construction", function() {
		it("should fail with undefined view", function() {
			expect(IssueTracker.Controls.Flipper.create).toThrow(new Error("Missing view for flipper."));
		});

		it("should fail with missing view", function() {
			expect(function() {
				IssueTracker.Controls.Flipper.create($(".invalid"));
			}).toThrow(new Error("Missing view for flipper."));
		});
	});

	describe("for non-stupid browsers", function () {
		beforeEach(function() {
			_flipper = IssueTracker.Controls.Flipper.create(_view, _chrome);
		});

		it("should add flipped class on first flip", function() {
			_flipper.toggle();
			expect(_view).toHaveClass("flipped");
		});

		it("should have no flipped class on second flip", function() {
			_flipper.toggle();
			_flipper.toggle();
			expect(_view).not.toHaveClass("flipped");
		});
	});

	describe("for IE8", function() {
		beforeEach(function () {
			_flipper = IssueTracker.Controls.Flipper.create(_view, _ie8);
		});

		it("should apply IE classes", function () {
			_flipper.toggle();

			expect(_view).not.toHaveClass("transition");
			expect(_view.find("div.back")).toHaveClass("shown");
		});
	});
	
	describe("for IE9", function () {
		beforeEach(function () {
			_flipper = IssueTracker.Controls.Flipper.create(_view, _ie9);
		});

		it("should apply IE classes", function () {
			_flipper.toggle();

			expect(_view).not.toHaveClass("transition");
			expect(_view.find("div.back")).toHaveClass("shown");
		});
	});
	
	describe("for IE10", function () {
		beforeEach(function () {
			_flipper = IssueTracker.Controls.Flipper.create(_view, _ie10);
		});

		it("should apply IE classes", function () {
			_flipper.toggle();

			expect(_view).not.toHaveClass("transition");
			expect(_view.find("div.back")).toHaveClass("shown");
		});
	});
});