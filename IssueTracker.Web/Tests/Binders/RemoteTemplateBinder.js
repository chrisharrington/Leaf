
describe("RemoteTemplateBinder", function () {

	describe("update", function () {
		var _element;
		var _update;
		var _view;
		var _viewData;
		var _remoteViewResult;

		beforeEach(function () {
			IssueTracker.virtualDirectory = function() { return ""; };

			_element = affix("div.element");
			_update = ko.bindingHandlers.remoteTemplate.update;
			_view = function () { return function () { return _viewData; }; };
			_viewData = {
				url: "a/remote/location.cshtml"
			};
			_remoteViewResult = "<div class=\"the-view\"></div>";
		});

		it("should fail with invalid view", function() {
			expect(function() { _update(_element, function() { return function() {}; }); });
		});

		xit("should display error message when call for remote view fails", function() {
			spyOn($, "get").andReturn({
				error: function (callback) { callback(); }
			});
			spyOn(IssueTracker.Feedback, "error");

			_update(_element, _view);
			expect(IssueTracker.Feedback.error).toHaveBeenCalledWith("An error occurred retrieving the view at " + _viewData.url + ". Please contact technical support.");
		});

		it("should execute view load method if available", function () {
			spyOn($, "get").andReturn(new ResolvedDeferred(_remoteViewResult));

			var loadCalled = false;
			_viewData.load = function() { loadCalled = true; };
			_update(_element, _view);
			expect(loadCalled).toBe(true);
		});
	});
});