IssueTracker.app.service("baseRepository", function($http) {
	this.get = function(url, parameters) {
		return $http.get(_buildUrl(url, parameters)).then(function(result) {
			return result.data;
		});
	};

	this.post = function(url, parameters) {
		return $http.post(url, parameters);
	};

	function _buildUrl(url, parameters) {
		var first = true;
		for (var name in parameters) {
			url += (first ? "?" : "&") + name + "=" + parameters[name];
			first = false;
		}
		return url;
	}
});