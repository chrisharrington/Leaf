IssueTracker.app.service("issue", function($rootScope, issueRepository, feedback) {
	this.visible = false;
	this.loading = false;
    
    this.milestone = {};
	
	this.show = function() {
		this.visible = true;
	};
    
    this.load = function(issue) {
		this.loading = true;
		this.show();
		
		var me = this;
//		issueRepository.id(issue.id).then(function(issue) {
//			me.issue = issue;
//			me.milestone = $rootScope.milestones.first(function(x) { return x.id === issue.milestoneId; });
//			me.priority = $rootScope.priorities.first(function(x) { return x.id === issue.priorityId; });
//			me.status = $rootScope.statuses.first(function(x) { return x.id === issue.statusId; });
//			me.developer = $rootScope.users.first(function(x) { return x.id === issue.developerId; });
//			me.tester = $rootScope.users.first(function(x) { return x.id === issue.testerId; });
//			me.issueType = $rootScope.issueTypes.first(function(x) { return x.id === issue.typeId; });
//		}).catch(function() {
//			feedback.error("An error has occurred while retrieving the issue details. Please try again later.");
//		}).finally(function() {
//			me.loading = false;
//		});
    };
	
	this.ok = function() {
		alert("ok");
	};
	
	this.cancel = function() {
		this.visible = false;
	};
});

