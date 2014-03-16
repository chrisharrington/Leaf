
(function (root) {

	var _container;
	var _issueId;

	root.attachedFiles = ko.observableArray();

	root.init = function(container) {
		_container = container;

		_container.on("click", "#browse", function () { _container.find("input[type='file']").click(); });
		_container.on("change", "input[type='file']", _attach);
	};

	root.load = function(issueId) {
		_issueId = issueId;
	};

	function _attach() {
		var file = _container.find("input[type='file']")[0].files[0];
		var observable = { id: guid(), name: file.name, size: file.size.toSizeString(), progress: ko.observable(0) };
		root.attachedFiles.push(observable);
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		fd.append("issueId", _issueId);
		fd.append("file", file);

		xhr.upload.addEventListener("progress", function(e) { observable.progress((e.position / e.totalSize).toFixed(2)); }, false);
		xhr.addEventListener("load", function() { observable.progress(100); }, false);
		//xhr.addEventListener("error", uploadFailed, false);
		//xhr.addEventListener("abort", uploadCanceled, false);

		xhr.open("POST", IssueTracker.virtualDirectory() + "Issues/AttachFile");
		xhr.send(fd);
	}

})(root("IssueTracker.CreateIssue.Upload"));