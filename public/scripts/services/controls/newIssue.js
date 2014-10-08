IssueTracker.app.service("newIssue", function() {
	this.visible = false;
	this.loading = false;
	
	this.show = function() {
		this.visible = true;
	};
	
	this.ok = function() {
		alert("ok");
	};
	
	this.cancel = function() {
		this.visible = false;
	};
});

