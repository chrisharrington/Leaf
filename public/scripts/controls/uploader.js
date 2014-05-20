(function(root) {

	root.upload = function(files) {
		var deferred = new $.Deferred();
		var pending = 0;
		$(files).each(function() {
			var current = this;
			if (current.uploaded === false) {
				pending++;
				var xhr = new XMLHttpRequest();
				var fd = new FormData();
				fd.append("file", current.file);

				xhr.upload.addEventListener("progress", function (e) {
					current.progress((e.position / e.totalSize).toFixed(2));
				}, false);
				xhr.addEventListener("load", function () {
					current.id(this.responseText);
					current.progress(100);
					current.uploaded = true;
					if (--pending == 0)
						deferred.resolve();
				}, false);
				xhr.addEventListener("error", function () {
					deferred.reject();
				}, false);

				xhr.open("POST", current.destination);
				xhr.send(fd);
			}
		});
		return deferred.promise();
	};

})(root("IssueTracker.Uploader"));

function UploaderFile(file, progress, destination, uploaded, name, id) {
	this.id = ko.observable();
	this.file = file;
	this.progress = progress;
	this.destination = destination;
	this.size = file.size.toSizeString();
	this.name = name || file.name;
	this.uploaded = uploaded || false;
}