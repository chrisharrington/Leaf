var mongoose = require("mongoose");
var models = require("./data/models");
var Promise = require("bluebird");
var moment = require("moment");

var issues = [
	{ name: "Add progress indicator for changing pages", number: "45", isDeleted: 0, opened: "Mar 11 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Set default values for choice tiles on the create issue page", number: "9", isDeleted: 0, opened: "Feb 23 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Remove the \"add comment\" button", number: "51", isDeleted: 0, opened: "Mar 10 2014 12:00AM", closed: "Mar 12 2014  3:02PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Clear create issue page's fields after issue is saved", number: "5", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 2", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Create CSS3 spinner, and associated fallback", number: "18", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 24 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add attached file section on issue details page", number: "16", isDeleted: 0, opened: "Feb 16 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Pending Development", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Limit width of app to 1680 pixels", number: "53", isDeleted: 0, opened: "Mar 10 2014 12:00AM", closed: "Mar 12 2014  5:01PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Added comment and existing comment times are in different timezones", number: "7", isDeleted: 0, opened: "Mar 10 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add animation for issue list", number: "56", isDeleted: 0, opened: "Mar 12 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Build user management page", number: "3", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "test", number: "1", isDeleted: 0, opened: "Feb 23 2014 12:00AM", closed: "", updated: "Feb 23 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add page transitions", number: "32", isDeleted: 0, opened: "Feb 27 2014 12:00AM", closed: "Mar 12 2014  2:47AM", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Create wrapper for jStorage", number: "37", isDeleted: 0, opened: "Mar  5 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Issue should automatically save when the user has clicked a transition button", number: "29", isDeleted: 0, opened: "Feb 26 2014 12:00AM", closed: "Mar 12 2014  2:30AM", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "blah", number: "2", isDeleted: 0, opened: "Feb 23 2014 12:00AM", closed: "", updated: "Feb 23 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add loading indicator for updating issues list", number: "43", isDeleted: 0, opened: "Mar  6 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "test", number: "57", isDeleted: 0, opened: "Mar 11 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Save current filter settings and restore them on page load", number: "28", isDeleted: 0, opened: "Feb 27 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Filters on the list page only allow the user to make one selection", number: "11", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "\"Comments\" on the create issue page should be changed to \"Detailed description\"", number: "34", isDeleted: 0, opened: "Feb 28 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Build header menu", number: "44", isDeleted: 0, opened: "Mar  7 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add fade animation for issue details in collapsed view", number: "46", isDeleted: 0, opened: "Mar 11 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "The \"no issues\" container shouldn't show up while issues are being loaded", number: "48", isDeleted: 0, opened: "Mar 10 2014 12:00AM", closed: "Mar 12 2014  8:03PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add email issue functionality", number: "27", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 25 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add sorting to issues list page", number: "24", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add description/comments search", number: "31", isDeleted: 0, opened: "Feb 26 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Pending Development", milestone: "Version 2", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "When no filters are set, should show filters as \"all\"", number: "30", isDeleted: 0, opened: "Feb 28 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Focus on \"issue details\" field when navigating to the create issue page", number: "21", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add popup to show more detailed issue information when hovering", number: "41", isDeleted: 0, opened: "Mar  5 2014 12:00AM", closed: "", updated: "Mar  6 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Widen the create issue button", number: "15", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 24 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add indicator icons to issue rows on the issues page", number: "23", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 25 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add advanced text editor functions for comments and detailed descriptions", number: "35", isDeleted: 0, opened: "Feb 28 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add toggle between views", number: "25", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "The height of each choice tile on the create issue page should be equal", number: "13", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 24 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "test feature", number: "39", isDeleted: 0, opened: "Mar  5 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Hook up the attached files section on the create issue page", number: "14", isDeleted: 0, opened: "Feb 22 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Pending Development", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "The \"save new issue\" button doesn't have loading styles applied when clicked", number: "22", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "IssuesController.Next should return serialized IssueViewModels", number: "19", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 25 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Disable session timeout for logged in user", number: "20", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Change hover colour", number: "52", isDeleted: 0, opened: "Mar 11 2014 12:00AM", closed: "Mar 12 2014  7:53PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Deleting an issue sets its project ID to null", number: "40", isDeleted: 0, opened: "Mar  5 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Most datetimes in the application have the time portion set to 12:00:00", number: "42", isDeleted: 0, opened: "Mar  4 2014 12:00AM", closed: "Mar 12 2014  2:31AM", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Progress bar fires when focusing back on the window even when not on the issues page", number: "54", isDeleted: 0, opened: "Mar 11 2014 12:00AM", closed: "Mar 12 2014  8:02PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add issue type", number: "4", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Cache issue list", number: "50", isDeleted: 0, opened: "Mar 10 2014 12:00AM", closed: "Mar 12 2014  3:42PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "The issue list's individual issue tiles are misaligned in Firefox", number: "8", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 28 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add audit trail section to issue details page", number: "17", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar  7 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Look into faster methods of choosing data on the issue details page", number: "55", isDeleted: 0, opened: "Mar 12 2014 12:00AM", closed: "", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "test defect", number: "38", isDeleted: 0, opened: "Mar  5 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Low", status: "Pending Development", milestone: "Backlog", type: "Defect", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Hook up date closed property", number: "10", isDeleted: 0, opened: "Feb 23 2014 12:00AM", closed: "Mar 12 2014  2:30AM", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Remove the \"updated\" field from the issue audit trail", number: "36", isDeleted: 0, opened: "Mar  3 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add global error \"page\"", number: "49", isDeleted: 0, opened: "Mar  8 2014 12:00AM", closed: "Mar 12 2014  6:46PM", updated: "Mar 12 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Increase font size for description on the create issue page", number: "7", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Feb 24 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Issue details URL should show number instead of description", number: "33", isDeleted: 0, opened: "Feb 27 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Add issue number to list", number: "6", isDeleted: 0, opened: "Feb 23 2014 12:00AM", closed: "", updated: "Mar 11 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "High", status: "Complete", milestone: "Version 1", type: "Feature", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Remove blue highlight from focused issue description and comments on create issue page", number: "26", isDeleted: 0, opened: "Feb 25 2014 12:00AM", closed: "", updated: "Feb 25 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Medium", status: "Pending Development", milestone: "Backlog", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
	{ name: "Build project management page", number: "12", isDeleted: 0, opened: "Feb 24 2014 12:00AM", closed: "", updated: "Mar  5 2014 12:00AM", developer: "Chris Harrington", tester: "Chris Harrington", priority: "Critical", status: "Pending Development", milestone: "Version 1", type: "Investigation", project: "Unnamed Issue Tracker", updatedBy: "Chris Harrington" },
];

var details = [
	"Nanobar, maybe?",
	"",
	"User can click the \"save changes\" button to add a comment and make any other changes.",
	"",
	"",
	"asdfadfadf",
	"Anything wider just looks ridiculous. ",
	"",
	"Issues should slide, fade or otherwise jump in to view.",
	"",
	"",
	"",
	"Should abstract away from specific library in the event of caching, etc.",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"Start with issues and users.",
	"",
	"Maybe replace it with something? Not sure what, though. Some sort of loader, presumably.",
	"",
	"",
	"Search bar should go on header, presumably.",
	"",
	"",
	"The collapsed view of the issues list is pretty bare. Should add a hover popup dealie which shows the user some more detailed information about the issue. Could use the sidebar here.",
	"",
	"",
	"",
	"",
	"",
	"",
	"Store the files in Azure blob storage? Cheaper than a database.",
	"",
	"",
	"",
	"Looks almost purple as it stands.",
	"",
	"",
	"The bar is supposed to indicate that the issues list is being refreshed. It shouldn't show up on other pages.",
	"Defect, feature, investigation. Others?",
	"The results for the issue list should be cached so that when a user is going back and forth between the list and wherever, the issue list shouldn't \"flash\". The issue list can be refreshed on page load, but remember the previous list. For example, a user arrives at the issue list page and the issue list is loaded. He or she clicks on an issue, makes some changes, and navigates back to the issue list. At this point, the cached list should already be displayed. A refresh should occur in the background and overwrite the list afterward.",
	"",
	"",
	"The flipper is relatively slow compared with a standard drop down list.",
	"",
	"",
	"",
	"This'll probably end up being an error view shown in place of the requested view via the RemoteTemplateBinder class.",
	"",
	"",
	"",
	"",
	"Allow user to update the project name, modify milestones, priorities, and statuses."
];

var user, project;
require("./data/connection").open().then(function() {
	return [models.User.findOneAsync(), models.Project.findOneAsync()];
}).spread(function(u, p) {
	project = p;
	user = u;
	return models.Issue.removeAsync();
}).then(function() {
	return [models.Priority.findAsync(), models.Status.findAsync(), models.Milestone.findAsync(), models.IssueType.findAsync()];
}).spread(function(p, s, m, t) {
	var priorities = _toObject(p);
	var statuses = _toObject(s);
	var milestones = _toObject(m);
	var types = _toObject(t);
	for (var i = 0; i < issues.length; i++) {
		var priority = priorities[issues[i].priority.toLowerCase()];
		issues[i].priorityId = priority._id;
		issues[i].priority = priority.name;
		issues[i].priorityOrder = priority.order;

		var status = statuses[issues[i].status.toLowerCase()];
		issues[i].statusId = status._id;
		issues[i].status = status.name;
		issues[i].statusOrder = status.order;

		var milestone = milestones[issues[i].milestone.toLowerCase()];
		issues[i].milestoneId = milestone._id;
		issues[i].milestone = milestone.name;

		var type = types[issues[i].type.toLowerCase()];
		issues[i].typeId = type._id;
		issues[i].type = type.name;

		issues[i].developerId = issues[i].testerId = issues[i].updatedById = user._id;
		issues[i].developer = issues[i].tester = issues[i].updatedBy = user.name;
		issues[i].project = project._id;
		issues[i].opened = _formatDate(issues[i].opened);
		issues[i].closed = _formatDate(issues[i].closed);
		issues[i].updated = _formatDate(issues[i].updated);
		issues[i].details = details[i];
		issues[i] = new models.Issue(issues[i]).save(function(err, saved) {
			//console.log(saved);
		});
	}
	return issues;
}).then(function() {
	console.log("Done!");
}).catch(function(e) {
	console.log("Error: " + e);
});

function _toObject(array) {
	var result = {};
	for (var i = 0; i < array.length; i++)
		result[array[i].name.toLowerCase()] = array[i];
	return result;
}

function _formatDate(date) {
	return date ? moment(date, "MMM DD YYYY h:mmA") : null;
}