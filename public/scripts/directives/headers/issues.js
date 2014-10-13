IssueTracker.app.directive("issuesHeader", function($rootScope) {
    return {
        restrict: "E",
        templateUrl: "templates/headers/issues.html",
        link: function(scope) {
            scope.loaded = false;
            $rootScope.issueSortVisible = false;
            $rootScope.selectedSort = "highest-priority";
            
            $rootScope.$on("$routeChangeSuccess", function(context, value) {
                scope.visible = value.$$route.controller === "issues";
            });
            
            $rootScope.$on("issuesLoaded", function(context, issues) {
                scope.loaded = true;
                scope.issueCount = issues.count;
            });
        }
    } 
});