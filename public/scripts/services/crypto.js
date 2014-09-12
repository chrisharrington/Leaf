IssueTracker.app.factory("crypto", function() {
	return {
		md5: function(plaintext) {
			return CryptoJS.MD5(plaintext).toString();
		}
	}
});