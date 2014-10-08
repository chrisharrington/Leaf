IssueTracker.app.service("details", function() {
    this.visible = false;
    this.loading = false;
    this.issue = {};
    
    this.load = function(issue) {
        this.issue = issue;
        this.visible = true;  
    };

    this.cancel = function() {
        this.visible = false;  
    };
});