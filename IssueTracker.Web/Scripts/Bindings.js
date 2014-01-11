
namespace("IssueTracker");

$(function() {

	IssueTracker.view = ko.observable();
	IssueTracker.title = ko.observable();

	IssueTracker.dialog = ko.observable();

	IssueTracker.isUnauthorized = ko.observable(false);
})