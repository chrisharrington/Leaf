
$(function() {
	IssueTracker.error = ko.observable("");
	IssueTracker.success = ko.observable("");

	IssueTracker.view = ko.observable();
	IssueTracker.title = ko.observable();

	IssueTracker.dialog = ko.observable();
	IssueTracker.popup = ko.observable();

	IssueTracker.isUnauthorized = ko.observable(false);
})