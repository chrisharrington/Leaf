(function() {
	ko.bindingHandlers.profile = {
		init: function(element, valueAccessor) {
			var raw = ko.unwrap(valueAccessor()), user, params = {
				size: raw.size || 35,
				userId: raw.userId || raw
			};

			$.each(IssueTracker.users(), function(i, current) {
				if (current.id() == params.userId)
					user = current;
			});

			ko.bindingHandlers.tooltip.init(element, user.name());
			$(element).attr("src", IssueTracker.Utilities.getUserProfileImageLocation(user.id()));
		}
	};

})();