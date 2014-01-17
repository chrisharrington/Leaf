
describe("Flipper", function () {
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

		var _chrome = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36";

		beforeEach(function() {
			navigator.userAgent = _chrome;
		});

		it("should add flipped class on first flip", function() {

		});

	});
});