IssueTracker.app.service("details", function() {
    this.visible = false;
    this.loading = false;
    
    this.load = function(issue) {
        this.visible = true;  
    };
});