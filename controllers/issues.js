var fs = require("fs");
var authenticate = require("../authentication/authenticate");
var authorize = require("../authentication/authorize");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var caches = require("../data/caches");
var mustache = require("mustache");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var formidable = require("formidable");
var storage = require("../storage/storage");
var notificationEmailer = require("../email/notificationEmailer");
var moment = require("moment");
var config = require("../config");

module.exports = function(app) {
	app.get("/issues", authenticate, function(request, response) {
		return fs.readFileAsync("public/views/issues.html").then(function(content) {
			response.send(content);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.get("/issues/list", authenticate, function(request, response) {
		var start = parseInt(request.query.start);
		if (isNaN(start))
			start = 1;
		var end = parseInt(request.query.end);
		if (isNaN(end))
			end = 50;

		return request.getProject().then(function(project) {
			return Promise.all([
				repositories.Issue.search(project.id, {
					priorities: _getIds(request.query.priorities),
					statuses: _getIds(request.query.statuses),
					developers: _getIds(request.query.developers),
					testers: _getIds(request.query.testers),
					milestones: _getIds(request.query.milestones),
					types: _getIds(request.query.types)
				}, request.query.direction, request.query.comparer, start, end),
				repositories.User.get({ projectId: project.id })
			]).spread(function(issues, users) {
				var usersDictionary = {};
				users.forEach(function(user) {
					usersDictionary[user.id] = user;
				});
				return issues.map(function(issue) {
					issue.developer = usersDictionary[issue.developerId].name;
					return issue;
				});
			}).then(function(issues) {
				return mapper.mapAll("issue", "issue-list-view-model", issues);
			}).then(function(issues) {
				response.send(issues, 200);
			})
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _getIds(query) {
			return query ? query.split(",") : [];
		}
	});

	app.get("/issues/details", authenticate, function(request, response) {
		var html, issue;
		var date = Date.now();
		return Promise.all([
			fs.readFileAsync("public/views/issueDetails.html"),
			repositories.Issue.number(request.query.projectId, parseInt(request.query.number))
		]).spread(function(html, issue) {
			date = Date.now();
			if (!issue) {
				response.send(404);
				return;
			}

			return Promise.all([
				repositories.Comment.issue(issue.id),
				repositories.IssueFile.issue(issue.id)
			]).spread(function(comments, files) {
				return Promise.all([
					mapper.map("issue", "issue-view-model", issue),
					mapper.mapAll("comment", "issue-history-view-model", comments),
					mapper.mapAll("issue-file", "issue-file-view-model", files)
				]);
			}).spread(function(issue, comments, files) {
				var model = issue;
				model.transitions = [];
				model.history = comments;
				model.files = files;
				response.send(mustache.render(html.toString(), { issue: JSON.stringify(model) }));
			});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.get("/issues/create", authenticate, function(request, response) {
		return fs.readFileAsync("public/views/createIssue.html").then(function(html) {
			response.send(mustache.render(html.toString()));
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.get("/issues/download-attached-file/:filename", authenticate, function(request, response) {
		return repositories.IssueFile.details(request.query.id).then(function(file) {
			response.contentType(file.name);
			return storage.get(file.container, file.id + "-" + file.name, response);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/update", authenticate, authorize("edit-issue"), function(request, response) {
		return Promise.all([
			mapper.map("issue-view-model", "issue", request.body),
			repositories.Status.get()
		]).spread(function(issue, statuses) {
			if (_issueIsClosed(issue.statusId, statuses))
				issue.closed = new Date();
			else
				issue.closed = null;
			return repositories.Issue.updateIssue(issue, request.user);
		}).then(function () {
			response.send(200);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _issueIsClosed(statusId, statuses) {
			var closed = false;
			statuses.forEach(function(status) {
				if (status.isClosedStatus && status.id == statusId)
					closed = true;
			});
			return closed;
		}
	});

	app.post("/issues/add-comment", authenticate, authorize("edit-issue"), function(request, response) {
		return mapper.map("issue-history-view-model", "comment", request.body).then(function(comment) {
			comment.created_at = request.body.date = new Date();
			comment.userId = request.body.userId = request.user.id;
			request.body.user = request.user.name;
			comment.issueId = request.body.issueId;
			return repositories.Comment.create(comment).then(function (createdId) {
				request.body.id = createdId;
			});
		}).then(function () {
			request.body.date = moment.call(this, request.body.date).format(config.call(this, "dateTimeFormat"));
			response.send(request.body, 200);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/delete-comment", authenticate, function(request, response) {
		return repositories.Comment.remove(request.body.comment.id).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/create", authenticate, authorize("create-issue"), function(request, response) {
		return Promise.all([
			mapper.map("issue-view-model", "issue", request.body),
			request.getProject()
		]).spread(function(model, project) {
			delete model.id;
			model.created_at = new Date();
			model.updated_at = new Date();
			model.projectId = project.id;
			return repositories.Issue.create(model);
		}).then(function () {
			response.send(200);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/delete", authenticate, authorize("delete-issue"), function(request, response) {
		var issue;
		return repositories.Issue.remove(request.body.id).then(function () {
			response.send(200);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/undelete", authenticate, authorize("delete-issue"), function(request, response) {
		return repositories.Issue.restore(request.body.id).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/issues/attach-file", authenticate, function(request, response) {
		var files = [], paths = [], id = "";
		return _readFilesFromRequest(request).then(function(f) {
			for (var name in f) {
				files.push(storage.set(request.project.id.toString(), id = mongoose.Types.ObjectId().toString(), request.query.name || f[name].name, f[name].path, f[name].size));
				paths.push(f[name].path);
			}
			return Promise.all(files);
		}).spread(function() {
			var created = [];
			for (var i = 0; i < arguments.length; i++) {
				var curr = arguments[i];
				created.push(repositories.IssueFile.create({ id: curr.id, name: request.query.name || curr.name, container: curr.container, size: curr.size, issue: request.query.issueId }));
			}
			return created;
		}).spread(function() {
			response.send(id, 200);
			return _cleanUpFiles(paths);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	function _readFilesFromRequest(request) {
		return new Promise(function(resolve, reject) {
			new formidable.IncomingForm().parse(request, function(err, fields, files) {
				if (err) reject(new Error(err));
				else resolve(files);
			});
		});
	}

	function _cleanUpFiles(paths) {
		var unlinks = [];
		for (var i = 0; i < paths.length; i++)
			unlinks.push(fs.unlinkAsync(paths[i]));
		return Promise.all(unlinks);
	}
};