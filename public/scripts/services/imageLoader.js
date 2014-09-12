IssueTracker.app.service("imageLoader", function($q) {
	return {
		load: function(urls) {
			var deferred = $q.defer(), count = urls.length, images = [];
			for (var i = 0; i < urls.length; i++) {
				var image = $("<img />", { style: "display: none !important", src: urls[i] });
				images.push(image);
				$("body").append(image.on("load", function () {
					count--;
					if (count == 0) {
						_removeImages(images);
						deferred.resolve();
					}
				}));
			}
			return deferred.promise;
		}
	};

	function _removeImages(images) {
		for (var i = 0; i < images.length; i++)
			images[i].remove();
	}
});