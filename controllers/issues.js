var fs = require("fs");
var authenticate = require("../authentication/authenticate");
var models = require("../data/models");
var mapper = require("../data/mapper");
var repositories = require("../data/repositories");
var mustache = require("mustache");
var Promise = require("bluebird");
var mongoose = require("mongoose");

module.exports = function(app) {
	app.get("/issues", authenticate, function(request, response) {
		fs.readFile("public/views/issues.html", function(err, content) {
			response.send(content);
		});
	});

	app.get("/issues/list", authenticate, function(request, response) {
		var start = parseInt(request.query.start);
		var end = parseInt(request.query.end);

		_applyFilters(models.Issue.find(), request)
			.sort(_buildSort(request))
			.skip(start-1)
			.limit(end-start+1)
			.exec(function(err, issues) {
				if (err) response.send("Error retrieving issues: " + e, 500);
				else response.send(mapper.mapAll("issue", "issue-view-model", issues));
			});
	});

	app.get("/issues/details", authenticate, function(request, response) {
		var projectId = request.query.projectId, html, issue;
		Promise.all([
			fs.readFileAsync("public/views/issueDetails.html"),
			repositories.Issue.number(request.query.projectId, request.query.number)
		]).spread(function(h, i) {
			html = h;
			issue = i;
			return [repositories.Transition.status(issue.statusId), repositories.Comment.issue(issue._id)];
		}).spread(function(transitions, comments) {
			var model = mapper.map("issue", "issue-view-model", issue);
			model.transitions = mapper.mapAll("transition", "transition-view-model", transitions);
			model.history = mapper.mapAll("comment", "issue-history-view-model", comments);
			response.send(!issue ? 404 : mustache.render(html.toString(), {
				issue: JSON.stringify(model)
			}));
		}).catch(function(e) {
			var message = "Error while rendering issue details for issue #" + request.query.number + ": " + e;
			console.log(message);
			response.send(message, 500);
		});
	});

	app.get("/issues/create", authenticate, function(request, response) {
		fs.readFileAsync("public/views/createIssue.html").then(function(html) {
			response.send(mustache.render(html.toString(), {
				issueId: mongoose.Types.ObjectId()
			}));
		}).catch(function(e) {
			response.send("Error while rendering create issue: " + e, 500);
		});
	});

	app.post("/issues/update", authenticate, function(request, response) {
		repositories.Issue.update(mapper.map("issue-view-model", "issue", request.body)).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error while updating issue: " + e;
			console.log(message);
			response.send(message, 500);
		});
	});

	app.post("/issues/add-comment", authenticate, function(request, response) {
		var comment = mapper.map("issue-history-view-model", "comment", request.body);
		comment.date = new Date();
		comment.user = request.user._id;
		repositories.Issue.details(request.body.issueId).then(function(issue) {
			comment.issue = issue._id;
		}).then(function() {
			return repositories.Comment.create(comment);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error adding comment: " + e;
			console.log(message);
			response.send(message, 500);
		});
	});

	app.post("/issues/create", authenticate, function(request, response) {
		var model = mapper.map("issue-view-model", "issue", request.body);
		Promise.all([
			repositories.Issue.getNextNumber(request.project),
			repositories.Milestone.details(model.milestoneId),
			repositories.Priority.details(model.priorityId),
			repositories.Status.details(model.statusId),
			repositories.User.details(model.developerId),
			repositories.User.details(model.testerId),
			repositories.IssueType.details(model.typeId)
		]).spread(function(number, milestone, priority, status, developer, tester, type) {
			model.number = number;
			model.milestone = milestone.name;
			model.priority = priority.name;
			model.priorityOrder = priority.order;
			model.status = status.name;
			model.statusOrder = status.order;
			model.developer = developer.name;
			model.tester = tester.name;
			model.type = type.name;
			model.opened = new Date();
			model.updated = new Date();
			model.updatedBy = request.user._id;
			model.project = request.project._id;
			return repositories.Issue.create(model);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error while creating issue: " + e;
			console.log(message);
			response.send(message, 500);
		});
	});

	app.post("/issues/delete", authenticate, function(request, response) {
		repositories.Issue.remove(request.body.id).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error while deleting issue: " + e;
			console.log(e);
			response.send(message, 500);
		});
	});

	function _buildSort(request) {
		var direction = request.query.direction;
		var comparer = request.query.comparer;
		if (comparer == "priority")
			comparer = "priorityOrder";
		else if (comparer == "status")
			comparer = "statusOrder";
		var sort = {};
		sort[comparer] = direction == "ascending" ? 1 : -1;
		sort.opened = 1;
		return sort;
	}

	function _applyFilters(query, request) {
		query = query.where("priorityId").in(request.query.priorities.split(","));
		query = query.where("statusId").in(request.query.statuses.split(","));
		query = query.where("developerId").in(request.query.developers.split(","));
		query = query.where("testerId").in(request.query.testers.split(","));
		query = query.where("milestoneId").in(request.query.milestones.split(","));
		query = query.where("typeId").in(request.query.types.split(","));
		return query;
	}
};