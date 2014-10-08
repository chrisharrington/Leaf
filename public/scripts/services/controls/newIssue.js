IssueTracker.app.service("newIssue", function() {
	this.blah = false;
	this.loading = false;
	
	this.show = function() {
		console.log("show");
		this.blah = true;
	};
	
	this.ok = function() {
		alert("ok");
	};
	
	this.cancel = function() {
		console.log("cancel");
		this.visible = false;
	};
});

