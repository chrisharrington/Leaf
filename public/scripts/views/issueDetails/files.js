(function(root) {

	var _input;
	var _issueId;

	root.files = ko.observableArray();
	root.uploading = ko.observable(false);

	root.init = function() {
		_input = $("#new-file");
		_input.on("change", _upload);
	};

	root.load = function(issueId, files) {
		_issueId = issueId;

		root.files([]);
		$.each(files, function(i, file) {
			root.files.push({ id: ko.observable(file.id), name: file.name, progress: ko.observable(100), size: file.size })
		});
	};

	root.upload = function() {
		_input.click();
	};

	function _upload() {
		root.uploading(true);
		$.each(_input[0].files, function(i, file) {
			root.files.push(_buildFile(file));
		});
		IssueTracker.Uploader.upload(root.files()).then(function() {
			_input.replaceWith(_input = _input.clone(true));
			_input.on("change", _upload);
			root.uploading(false);
		});
	}

	function _buildFile(file) {
		var orig = file.name, name = file.name, count = 2;
		while (_doesFileExist(name)) {
			var parts = name.split(".");
			parts[0] = orig.split(".")[0] + " (" + count++ + ")";
			name = parts.join(".");
		}
		return new UploaderFile(file, ko.observable(20), IssueTracker.virtualDirectory + "issues/attach-file?issueId=" + _issueId + "&name=" + name, false, name);
	}

	function _doesFileExist(name) {
		var exists = false;
		$.each(root.files(), function(i, current) {
			if (name == current.name)
				exists = true;
		});
		return exists;
	}

})(root("IssueTracker.IssueDetails.Files"));