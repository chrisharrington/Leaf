IssueTracker.app.service("issue", function() {
	this.visible = false;
	this.loading = false;
    
    this.milestone = {};
	
	this.show = function() {
		this.visible = true;
	};
    
    this.load = function(issue) {
        this.issue = issue;
        this.show();
    };
	
	this.ok = function() {
		alert("ok");
	};
	
	this.cancel = function() {
		this.visible = false;
	};
});

