
(function (root) {

	var _container;
	var _issueId;

	root.attachedFiles = ko.observableArray();
	root.uploading = ko.observable(false);

	root.init = function(container) {
		_container = container;

		_container.on("click", "#browse", function () { _container.find("input[type='file']").click(); });
		_container.on("change", "input[type='file']", _attach);
	};

	root.load = function(issueId) {
		root.attachedFiles([]);
		_issueId = issueId;
	};

	root.upload = function() {
		_uploadAllFiles();
	};

	root.remove = function(file) {
		root.attachedFiles.remove(function(f) {
			return f.id == file.id;
		});
	};

	function _attach() {
		$.each(_uniqueFiles(_container.find("input[type='file']")[0].files), function() {
			root.attachedFiles.push({ id: guid(), file: this, name: this.name, size: this.size.toSizeString(), progress: ko.observable(0) });
		});
	}

	function _uploadAllFiles() {
		var files = [];
		$(root.attachedFiles()).each(function(i, file) {
			files.push(new UploaderFile(file.file, file.progress, IssueTracker.virtualDirectory + "issues/attach-file?issueId=" + _issueId));
		});
		return IssueTracker.Uploader.upload(files);
	}

	function _uniqueFiles(files) {
		var added = {};
		$.each(root.attachedFiles(), function() {
			added[this.name] = true;
		});

		var uniques = [];
		$.each(files, function() {
			if (!added[this.name])
				uniques.push(this);
		});
		return uniques;
	}

})(root("IssueTracker.CreateIssue.Upload"));