(function(root) {

	root.create = function() {
		IssueTracker.Dialog.load("create-github-integration");

		//window.open("https://github.com/login/oauth/authorize?client_id=258d6a5278f08ff6016e&redirect_uri=http://" + IssueTracker.projectName().formatForUrl() +".leafissuetracker.com/hook/github/callback&scope=repo&state=12345");
		//window.open("https://github.com/login/oauth/authorize?client_id=258d6a5278f08ff6016e&redirect_uri=http://localhost:8888/hook/callback/GitHub&scope=repo&state=12345");
		window.open("http://localhost:8888/hook/callback/GitHub?code=123456789");
	};

	root.code = function(data) {
		var blah = _getCode(data);
	};

	function _getCode(data) {
		var keyValues = data.substring(1).split("&"), result;
		$.each(keyValues, function(i) {
			var pair = this.split("=");
			if (pair[0] == "code")
				result = pair[1];
		});
		return result;
	}

})(root("IssueTracker.Project.SourceControl.GitHub"));