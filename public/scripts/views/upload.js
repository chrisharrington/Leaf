
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

	function _attach() {
		root.uploading(true);
		var files = _container.find("input[type='file']")[0].files;
		var file = files[files.length-1];;
		var observable = { id: guid(), name: file.name, size: file.size.toSizeString(), progress: ko.observable(0) };
		root.attachedFiles.push(observable);
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		fd.append("file", file);

		xhr.upload.addEventListener("progress", function(e) { observable.progress((e.position / e.totalSize).toFixed(2)); }, false);
		xhr.addEventListener("load", function() { observable.progress(100); root.uploading(false); }, false);
		//xhr.addEventListener("error", uploadFailed, false);
		//xhr.addEventListener("abort", uploadCanceled, false);

		xhr.open("POST", IssueTracker.virtualDirectory() + "issues/attach-file?issueId=" + _issueId);
		xhr.send(fd);
	}

})(root("IssueTracker.CreateIssue.Upload"));