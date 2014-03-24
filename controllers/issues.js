var fs = require("fs");
var authenticate = require("../authentication/authenticate");
var models = require("../data/models");
var mapper = require("../data/mapper");
var repositories = require("../data/repositories");
var mustache = require("mustache");
var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/issues", authenticate.auth, function(request, response) {
		fs.readFile("public/views/issues.html", function(err, content) {
			response.send(content);
		});
	});

	app.get("/issues/list", authenticate.authIgnoreSession, function(request, response) {
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

	app.get("/issues/details", authenticate.auth, function(request, response) {
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

	app.post("/issues/update", authenticate.auth, function(request, response) {
		repositories.Issue.update(mapper.map("issue-view-model", "issue", request.body)).then(function() {
			response.send(200);
		}).catch(function(e) {
			var message = "Error while updating issue: " + e;
			console.log(message);
			response.send(message, 500);
		});
	});

	app.post("/issues/add-comment", authenticate.auth, function(request, response) {
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

	/*
	 private IEnumerable<IssueHistoryViewModel> BuildIssueHistory(IEnumerable<IssueAudit> audits, IEnumerable<IssueComment> comments)
	 {
	 var history = new List<IssueHistoryViewModel>();
	 if (audits != null)
	 history.AddRange(audits.Select(x => new IssueHistoryViewModel { date = x.Date.ToLongApplicationString(TimezoneOffsetInMinutes), text = BuildAuditString(x), user = x.User.ToString() }));
	 if (comments != null)
	 history.AddRange(comments.Select(x => new IssueHistoryViewModel { date = x.Date.ToLongApplicationString(TimezoneOffsetInMinutes), text = x.Text, user = x.User.ToString() }));
	 return history.OrderByDescending(x => DateTime.Parse(x.date));
	 }
	 */

	function _buildSort(request) {
		var direction = request.query.direction;
		var comparer = request.query.comparer;
		if (comparer == "priority")
			comparer = "priorityOrder";
		else if (comparer == "status")
			comparer = "statusOrder";
		var sort = {};
		sort[comparer] = direction == "ascending" ? 1 : -1;
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