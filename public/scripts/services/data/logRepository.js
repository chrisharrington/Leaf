IssueTracker.app.factory("logRepository", function($http, $q, $timeout) {
	var that;
	return that = {
		insert: function(log) {
			var deferred = $q.defer();

			var max = 0;
			log.id = that.all().then(function(logs) {
				for (var i = 0; i < logs.length; i++)
					max = Math.max(max, logs[i].id);
			});

			log.id = max+1;
			log.collectionId = 0;
			$timeout(function() {
				deferred.resolve(log);
			}, 500);
			return deferred.promise;
		},

		all: function() {
			return $http.get("scripts/fixtures/logs.json").then(function(result) {
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

		latest: function() {
			return $http.get("scripts/fixtures/latestLogs.json").then(function(result) {
				result.data.sort(function (first, second) {
					return first.created < second.created ? -1 : first.created == second.created ? 0 : 1;
				});

				return result.data;
			});
		}
	}
});
