
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
		var deferred = new $.Deferred();
		var pending = root.attachedFiles.length;
		$(root.attachedFiles()).each(function() {
			var observable = this;
			var xhr = new XMLHttpRequest();
			var fd = new FormData();
			fd.append("file", observable.file);

			xhr.upload.addEventListener("progress", function (e) {
				observable.progress((e.position / e.totalSize).toFixed(2));
			}, false);
			xhr.addEventListener("load", function () {
				observable.progress(100);
				if (--pending == 0)
					deferred.resolve();
			}, false);
			xhr.addEventListener("error", function() {
				deferred.reject();
			}, false);

			xhr.open("POST", IssueTracker.virtualDirectory + "issues/attach-file?issueId=" + _issueId);
			xhr.send(fd);
		});
		return deferred.promise();
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