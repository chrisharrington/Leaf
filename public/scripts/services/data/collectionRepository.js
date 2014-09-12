IssueTracker.app.factory("collectionRepository", function($http) {
	var that;
	return that = {
		all: function() {
			return $http.get("scripts/fixtures/collections.json").then(function(result) {
				result.data.sort(function (first, second) {
					if (first.name < second.name)
						return -1;
					if (first.name == second.name)
						return 0;
					return 1;
				});

				return result.data;
			});
		},

		contains: function(string) {
			return that.all().then(function(all) {
				var collections = [];
				if (!string || string == "")
					return collections;

				string = string.toLowerCase();
				for (var i = 0; i < all.length; i++)
					if (all[i].name.toLowerCase().indexOf(string) > -1)
						collections.push(all[i]);
				return collections;
			});
		}
	}
});
