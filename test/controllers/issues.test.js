require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapping/mapper");
var mustache = require("mustache");
var mongoose = require("mongoose");
var storage = require("../../storage/storage");
var notificationEmailer = require("../../email/notificationEmailer");
var formidable = require("formidable");

var sut = require("../../controllers/issues");

function _restoreStubs(stubs) {
	for (var name in stubs)
		stubs[name].restore();
}

describe("issues", function() {
	describe("post /issues/attach-file", function() {
		it("should set post /issues/attach-file route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/attach-file", sinon.match.func, sinon.match.func));
		});

		it("should send 200", function() {
			return _runAttachFile({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 when parsing fails", function() {
			return _runAttachFile({
				parse: function(request, callback) { callback(new Error("oh noes! an error!")); },
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when setting storage values fails", function() {
			return _runAttachFile({
				storageSet: sinon.stub(storage, "set").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when creating the file fails", function() {
			return _runAttachFile({
				issueFileCreate: sinon.stub(repositories.IssueFile, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when cleaning up temp files fails", function() {
			return _runAttachFile({
				fsUnlink: sinon.stub(fs, "unlinkAsync").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create an object id", function() {
			return _runAttachFile({
				mongooseObjectId: sinon.stub(mongoose.Types, "ObjectId").throws(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should set appropriate data to storage", function() {
			var projectId = "the id of the project";
			var objectId = "the generated object id";
			var name = "the generated name";
			var path = "the generated path";
			var size = "the generated size";
			return _runAttachFile({
				projectId: projectId,
				mongooseObjectIdResult: objectId,
				files: { "file1.js": { container: "the generated container", name: name, path: path, size: size }},
				assert: function(result) {
					assert(result.stubs.storageSet.calledWith(projectId, objectId, name, path, size));
				}
			})
		});

		it("should insert issue files with data as inserted into storage", function() {
			var storage = { container: "the generated storage container", id: "the generated storage id", name: "the generated storage name", file: "the generated storage contents", size: "the generated storage size" };
			var issueId = "the generated issue id";
			return _runAttachFile({
				storageSetResult: storage,
				issueId: issueId,
				assert: function(result) {
					assert(result.stubs.issueFileCreate.calledWith({ _id: storage.id, name: storage.name, container: storage.container, size: storage.size, issue: issueId }));
				}
			})
		});

		function _runAttachFile(params) {
			params = params || {};
			params.stubs = {
				mongooseObjectId: params.mongooseObjectId || sinon.stub(mongoose.Types, "ObjectId").returns(params.mongooseObjectIdResult || "the object id"),
				parse: sinon.stub(formidable, "IncomingForm").returns({ parse: params.parse || function(request, callback) { callback(null, null, params.files || { id: "the file id", name: "the file name", file: "the file contents", size: "the file size" }); } }),
				storageSet: params.storageSet || sinon.stub(storage, "set").resolves(params.storageSetResult || { container: "the storage container", id: "the storage id", name: "the storage name", file: "the storage contents", size: "the storage size" }),
				issueFileCreate: params.issueFileCreate || sinon.stub(repositories.IssueFile, "create").resolves(),
				fsUnlink: params.fsUnlink || sinon.stub(fs, "unlinkAsync").resolves()
			};

			params.verb = "post";
			params.route = "/issues/attach-file";
			params.request = params.request || {
				project: {
					_id: params.projectId || "the project id"
				},
				user: {
					_id: params.userId || "the user id"
				},
				query: {
					issueId: params.issueId || "the issue id"
				}
			};

			return _run(params).finally(function () {
				_restoreStubs(params.stubs);
			});
		}
	});

	describe("post /issues/delete", function() {
		it("should set post /issues/delete route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/delete", sinon.match.func, sinon.match.func));
		});

		it("should send 200", function() {
			return _runDelete({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should send 500 when failing to get issue details", function() {
			return _runDelete({
				issueDetails: sinon.stub(repositories.Issue, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to remove notifications for the deleted issue", function() {
			return _runDelete({
				notificationRemoveForIssue: sinon.stub(repositories.Notification, "removeForIssue").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to delete issue", function() {
			return _runDelete({
				issueRemove: sinon.stub(repositories.Issue, "remove").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to get user details", function() {
			return _runDelete({
				userDetails: sinon.stub(repositories.User, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to send a notification email", function() {
			return _runDelete({
				notificationEmailerIssueDeleted: sinon.stub(notificationEmailer, "issueDeleted").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to get issue details", function() {
			return _runDelete({
				notificationCreate: sinon.stub(repositories.Notification, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should remove issue as specified with the issue ID in the request body", function() {
			var id = "this is the id of the issue to delete";
			return _runDelete({
				request: {
					body: {
						id: id
					}
				},
				assert: function(request) {
					assert(request.stubs.issueRemove.calledWith(id));
				}
			})
		});

		it("should remove notifications for the issue that's slated for deletion", function() {
			var id = "this is the id of the issue to delete";
			return _runDelete({
				request: {
					body: {
						id: id
					}
				},
				assert: function(request) {
					assert(request.stubs.notificationRemoveForIssue.calledWith(id));
				}
			})
		});

		it("should not create notification if user ID matches the developer ID of the issue being deleted", function() {
			var id = "the matching user and developer id";
			return _runDelete({
				userId: id,
				developerId: id,
				assert: function(result) {
					assert(result.stubs.notificationCreate.notCalled);
				}
			})
		});

		it("should not get user details if user ID matches the developer ID of the issue being deleted", function() {
			var id = "the matching user and developer id";
			return _runDelete({
				userId: id,
				developerId: id,
				assert: function(result) {
					assert(result.stubs.userDetails.notCalled);
				}
			})
		});

		it("should not send user notification email if the user's email notifications are disabled", function() {
			return _runDelete({
				emailNotificationForIssueDeleted: false,
				assert: function(result) {
					assert(result.stubs.notificationEmailerIssueDeleted.notCalled);
				}
			})
		});

		function _runDelete(params) {
			params = params || {};
			params.stubs = {
				issueDetails: params.issueDetails || sinon.stub(repositories.Issue, "details").resolves(params.issueDetailsResult || { _id: params.issueId || "the issue id", developerId: params.developerId || "the developer id" }),
				notificationRemoveForIssue: params.notificationRemoveForIssue || sinon.stub(repositories.Notification, "removeForIssue").resolves(),
				issueRemove: params.issueRemove || sinon.stub(repositories.Issue, "remove").resolves(),
				userDetails: params.userDetails || sinon.stub(repositories.User, "details").resolves({ emailNotificationForIssueDeleted: params.emailNotificationForIssueDeleted == undefined ? true : params.emailNotificationForIssueDeleted }),
				notificationEmailerIssueDeleted: params.notificationEmailerIssueDeleted || sinon.stub(notificationEmailer, "issueDeleted").resolves(),
				notificationCreate: params.notificationCreate || sinon.stub(repositories.Notification, "create").resolves()
			};

			params.verb = "post";
			params.route = "/issues/delete";
			params.request = params.request || {
				body: {
					id: params.id || "the id"
				},
				user: {
					_id: params.userId || "the user id"
				}
			};

			return _run(params).finally(function () {
				_restoreStubs(params.stubs);
			});
		}
	});

	describe("post /issues/create", function() {
		it("should set post /issues/create route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/create", sinon.match.func, sinon.match.func));
		});

		it("should send 200", function() {
			return _runCreate({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			})
		});

		it("should send 500 when failing to map", function() {
			return _runCreate({
				mapperMap: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get next issue number", function() {
			return _runCreate({
				issueNextNumber: sinon.stub(repositories.Issue, "getNextNumber").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get milestone details", function() {
			return _runCreate({
				milestoneDetails: sinon.stub(repositories.Milestone, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get priority details", function() {
			return _runCreate({
				priorityDetails: sinon.stub(repositories.Priority, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get status details", function() {
			return _runCreate({
				statusDetails: sinon.stub(repositories.Status, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get user details", function() {
			return _runCreate({
				userDetails: sinon.stub(repositories.User, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get issue type details", function() {
			return _runCreate({
				issueTypeDetails: sinon.stub(repositories.IssueType, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create the issue", function() {
			return _runCreate({
				createIssue: sinon.stub(repositories.Issue, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create the notification", function() {
			return _runCreate({
				createNotification: sinon.stub(repositories.Notification, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to sending the notification email", function() {
			return _runCreate({
				emailNotificationForIssueAssigned: true,
				notificationEmailerIssueAssigned: sinon.stub(notificationEmailer, "issueAssigned").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should get next number from project specified in request", function() {
			var project = {
				_id: "12345"
			};
			return _runCreate({
				request: {
					project: project
				},
				assert: function(result) {
					assert(result.stubs.issueNextNumber.calledWith(project))
				}
			})
		});

		it("should get milestone details using milestone ID from issue in request.body", function() {
			var issue = { milestoneId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.milestoneDetails.calledWith(issue.milestoneId))
				}
			})
		});

		it("should get milestone details using priority ID from issue in request.body", function() {
			var issue = { priorityId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.priorityDetails.calledWith(issue.priorityId))
				}
			})
		});

		it("should get status details using status ID from issue in request.body", function() {
			var issue = { statusId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.statusDetails.calledWith(issue.statusId))
				}
			})
		});

		it("should get developer details using developer ID from issue in request.body", function() {
			var issue = { developerId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.userDetails.calledWith(issue.developerId))
				}
			})
		});

		it("should get tester details using tester ID from issue in request.body", function() {
			var issue = { testerId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.userDetails.calledWith(issue.testerId))
				}
			})
		});

		it("should get issue type details using issue type ID from issue in request.body", function() {
			var issue = { developerId: "12345" };
			return _runCreate({
				mapperMapResult: issue,
				assert: function(result) {
					assert(result.stubs.userDetails.calledWith(issue.issueTypeId))
				}
			})
		});

		it("should set model parameters based on retrieved data", function() {
			var model = {
				number: "the old number",
				milestone: "the old milestone name",
				priority: "the old priority name",
				priorityOrder: "the old priority order",
				status: "the old status name",
				statusOrder: "the old status order",
				developer: "the old developer name",
				tester: "the old tester name",
				type: "the old type",
				opened: "the old opened",
				updated: "the old updated",
				updatedBy: "the old updated by",
				project: "the old project",
				developerId: "the developer id",
				testerId: "the tester id"
			};
			var date = Date.now();
			var userId = "the new user id";
			var projectId = "the new project id";
			return _runCreate({
				issueNextNumberResult: 2,
				milestoneDetailsResult: { name: "the new milestone name" },
				priorityDetailsResult: { name: "the new priority name", order: "the new priority order" },
				statusDetailsResult: { name: "the new status name", order: "the new status order" },
				developerName: "the new developer name",
				testerName: "the new tester name",
				issueTypeDetailsResult: { name: "the new type name" },
				mapperMapResult: model,
				date: date,
				userId: userId,
				projectId: projectId,
				assert: function(result) {
					assert(model.number == 2);
					assert(model.milestone == "the new milestone name");
					assert(model.priority == "the new priority name");
					assert(model.priorityOrder == "the new priority order");
					assert(model.status == "the new status name");
					assert(model.statusOrder == "the new status order");
					assert(model.developer == "the new developer name");
					assert(model.tester == "the new tester name");
					assert(model.type == "the new type name");
					assert(model.opened == date);
					assert(model.updated == date);
					assert(model.updatedBy == userId);
					assert(model.project == projectId);
				}
			})
		});

		it("should not send notification email if the user has email notification disabled", function() {
			return _runCreate({
				emailNotificationForIssueAssigned: false,
				assert: function(result) {
					assert(result.stubs.notificationEmailerIssueAssigned.notCalled);
				}
			})
		});

		it("should not create a notification if the developer and creating user are the same", function() {
			var id = "12345";
			return _runCreate({
				developerId: id,
				userId: id,
				assert: function(result) {
					assert(result.stubs.createNotification.notCalled);
				}
			});
		});

		it("should not send a notification email if the developer and creating user are the same", function() {
			var id = "12345";
			return _runCreate({
				emailNotificationForIssueAssigned: true,
				developerId: id,
				userId: id,
				assert: function(result) {
					assert(result.stubs.notificationEmailerIssueAssigned.notCalled);
				}
			});
		});

		function _runCreate(params) {
			params = params || {};
			params.stubs = {
				mapperMap: params.mapperMap || sinon.stub(mapper, "map").resolves(params.mapperMapResult || { date: new Date(), user: "the user id", developerId: params.developerId || "the developer id", testerId: params.testerId || "the tester id" }),
				issueNextNumber: params.issueNextNumber || sinon.stub(repositories.Issue, "getNextNumber").resolves(params.issueNextNumberResult || 10),
				milestoneDetails: params.milestoneDetails || sinon.stub(repositories.Milestone, "details").resolves(params.milestoneDetailsResult || { name: "the milestone name" }),
				priorityDetails: params.priorityDetails || sinon.stub(repositories.Priority, "details").resolves(params.priorityDetailsResult || { name: "the priority name", order: 1 }),
				statusDetails: params.statusDetails || sinon.stub(repositories.Status, "details").resolves(params.statusDetailsResult || { name: "the status name", order: 2 }),
				userDetails: params.userDetails || sinon.stub(repositories.User, "details"),
				issueTypeDetails: params.issueTypeDetails || sinon.stub(repositories.IssueType, "details").resolves(params.issueTypeDetailsResult || { name: "the issue type name" }),
				createIssue: params.createIssue || sinon.stub(repositories.Issue, "create").resolves({ developerId: params.developerId || "the developer id" }),
				createNotification: params.createNotification || sinon.stub(repositories.Notification, "create").resolves({}),
				notificationEmailerIssueAssigned: params.notificationEmailerIssueAssigned || sinon.stub(notificationEmailer, "issueAssigned").resolves({}),
				dateNow: params.dateNow || sinon.stub(Date, "now").returns(params.date || new Date())
			};

			if (!params.userDetails) {
				params.stubs.userDetails.withArgs(params.developerId || "the developer id").resolves({ name: params.developerName || "the developer name", _id: params.developerId || "the developer id", emailNotificationForIssueAssigned: params.emailNotificationForIssueAssigned == undefined ? true : params.emailNotificationForIssueAssigned });
				params.stubs.userDetails.withArgs(params.testerId || "the tester id").resolves({ name: params.testerName || "the tester name", _id: params.testerId || "the tester id" });
			}

			params.verb = "post";
			params.route = "/issues/create";
			params.request = params.request || {
				user: {
					_id: params.userId || "the user id"
				},
				project: {
					_id: params.projectId || "the project id"
				}
			};

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("post /issues/add-comment", function() {
		it("should set post /issues/add-comment route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/add-comment", sinon.match.func, sinon.match.func));
		});

		it("should send 200", function() {
			return _runAddComment({
				assert: function(result) {
					assert(result.response.send.calledOnce);
				}
			});
		});

		it("should send 500 when failing to map", function() {
			return _runAddComment({
				mapperMap: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get issue details", function() {
			return _runAddComment({
				issueDetails: sinon.stub(repositories.Issue, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create a comment", function() {
			return _runAddComment({
				commentCreate: sinon.stub(repositories.Comment, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get user details", function() {
			return _runAddComment({
				userDetails: sinon.stub(repositories.User, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to send a notification email", function() {
			return _runAddComment({
				notificationEmailerNewComment: sinon.stub(notificationEmailer, "newComment").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create a notification", function() {
			return _runAddComment({
				notificationCreate: sinon.stub(repositories.Notification, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should not send notification email when user's email notifications are disabled", function() {
			return _runAddComment({
				emailNotificationForNewCommentForAssignedIssue: false,
				assert: function(result) {
					assert(result.stubs.notificationEmailerNewComment.notCalled);
				}
			});
		});

		it("should not create notification if user performing the add has the same ID as the assigned developer", function() {
			var id = "the id";
			return _runAddComment({
				userId: id,
				developerId: id,
				assert: function(result) {
					assert(result.stubs.notificationCreate.notCalled);
				}
			});
		});

		it("should not send the notificatoin email if user performing the add has the same ID as the assigned developer", function() {
			var id = "the id";
			return _runAddComment({
				userId: id,
				developerId: id,
				assert: function(result) {
					assert(result.stubs.notificationEmailerNewComment.notCalled);
				}
			});
		});

		it("should send new comment email notification when user settings say so", function() {
			var user = { name: "blah", emailNotificationForNewCommentForAssignedIssue: true };
			var issue = { developerId: "the developer id", number: 10, name: "boo" };
			var commentText = "the comment text";
			return _runAddComment({
				userDetailsResult: user,
				issueDetailsResult: issue,
				mapperMapResult: {
					text: commentText
				},
				assert: function(result) {
					assert(result.stubs.notificationEmailerNewComment.calledWith(user, issue, commentText));
				}
			});
		});

		it("should send request.body with userId set to request.user.id", function() {
			var id = "the user id";
			return _runAddComment({
				userId: id,
				assert: function(result) {
					assert(result.response.send.calledWith({
						date: sinon.match.any,
						id: sinon.match.any,
						issueId: sinon.match.any,
						user: sinon.match.any,
						userId: id
					}));
				}
			});
		});

		it("should send request.body with date set to nearly now", function() {
			var date = Date.now();
			return _runAddComment({
				date: date,
				assert: function(result) {
					assert(result.response.send.calledWith({
						date: date,
						id: sinon.match.any,
						issueId: sinon.match.any,
						user: sinon.match.any,
						userId: sinon.match.any
					}));
				}
			});
		});

		it("should send request.body with user name set to request.user.name", function() {
			var name = "the name";
			return _runAddComment({
				userName: name,
				assert: function(result) {
					assert(result.response.send.calledWith({
						date: sinon.match.any,
						id: sinon.match.any,
						issueId: sinon.match.any,
						user: name,
						userId: sinon.match.any
					}));
				}
			})
		});

		it("should send request.body with issue id unchanged", function() {
			var issueId = "the issue id";
			return _runAddComment({
				issueId: issueId,
				assert: function(result) {
					assert(result.response.send.calledWith({
						date: sinon.match.any,
						id: sinon.match.any,
						issueId: issueId,
						user: sinon.match.any,
						userId: sinon.match.any
					}));
				}
			})
		});

		it("should send request.body with id set to created id", function() {
			var id = "the newly created comment id";
			return _runAddComment({
				commentCreateResult: { _id: id },
				assert: function(result) {
					assert(result.response.send.calledWith({
						date: sinon.match.any,
						id: id,
						issueId: sinon.match.any,
						user: sinon.match.any,
						userId: sinon.match.any
					}));
				}
			})
		});

		function _runAddComment(params) {
			params = params || {};
			params.stubs = {
				mapperMap: params.mapperMap || sinon.stub(mapper, "map").resolves(params.mapperMapResult || { date: new Date(), user: "the user id" }),
				issueDetails: params.issueDetails || sinon.stub(repositories.Issue, "details").resolves(params.issueDetailsResult || { _id: "the id", developerId: params.developerId || "the developer id" }),
				commentCreate: params.commentCreate || sinon.stub(repositories.Comment, "create").resolves(params.commentCreateResult || {}),
				userDetails: params.userDetails || sinon.stub(repositories.User, "details").resolves(params.userDetailsResult || { emailNotificationForNewCommentForAssignedIssue: params.emailNotificationForNewCommentForAssignedIssue == undefined ? true : params.emailNotificationForNewCommentForAssignedIssue }),
				notificationEmailerNewComment: params.notificationEmailerNewComment || sinon.stub(notificationEmailer, "newComment").resolves(params.notificationEmailerNewCommentResult || {}),
				notificationCreate: params.notificationCreate || sinon.stub(repositories.Notification, "create").resolves(params.notificationCreateResult || {}),
				now: params.now || sinon.stub(Date, "now").returns(params.date || Date.now())
			};

			params.verb = "post";
			params.route = "/issues/add-comment";
			params.request = params.request || {
				user: params.query || {
					_id: params.userId || "the user id",
					name: params.userName || "the user name"
				},
				body: {
					issueId: params.issueId || "the issue id"
				}
			};

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("post /issues/delete-comment", function() {
		it("should set post /issues/delete-comment route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/delete-comment", sinon.match.func, sinon.match.func));
		});

		it("should call commentRepository.remove with request.body.comment.id", function() {
			var remove = sinon.stub(repositories.Comment, "remove").resolves();
			var id = "the id of the comment to remove";

			return _run({
				request: { body: { comment: { id: id } } },
				verb: "post",
				route: "/issues/delete-comment",
				assert: function() {
					assert(remove.calledWith(id));
				}
			}).finally(function() {
				remove.restore();
			});
		});

		it("should send 200", function() {
			var remove = sinon.stub(repositories.Comment, "remove").resolves();

			return _run({
				request: { body: { comment: { id: "the id" } } },
				verb: "post",
				route: "/issues/delete-comment",
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			}).finally(function() {
				remove.restore();
			});
		});

		it("should send 500 when failing to remove the comment", function() {
			var remove = sinon.stub(repositories.Comment, "remove").rejects("oh noes!");

			return _run({
				request: { body: { comment: { id: "the id" } } },
				verb: "post",
				route: "/issues/delete-comment",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			}).finally(function() {
				remove.restore();
			});
		});
	});

	describe("post /issues/update", function() {
		it("should set post /issues/update route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.post.calledWith("/issues/update", sinon.match.func, sinon.match.func));
		});

		it("should send 200", function() {
			return _runUpdateIssue({
				assert: function(result) {
					assert(result.response.send.calledWith(200));
				}
			});
		});

		it("should not create notification if developer is the same as the updating user", function() {
			var id = "the user id";
			return _runUpdateIssue({
				userId: id,
				developerId: id,
				assert: function(results) {
					assert(results.stubs.notificationCreate.notCalled);
				}
			});
		});

		it("should not send notification email when user has email notification disabled", function() {
			return _runUpdateIssue({
				emailNotificationForIssueUpdated: false,
				assert: function(result) {
					assert(result.stubs.notificationEmailerIssueUpdated.notCalled);
				}
			});
		});

		it("should send 500 when failing to map issue view model", function() {
			return _runUpdateIssue({
				mapperMap: sinon.stub(mapper, "map").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to update", function() {
			return _runUpdateIssue({
				issueUpdate: sinon.stub(repositories.Issue, "update").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to get user details", function() {
			return _runUpdateIssue({
				userDetails: sinon.stub(repositories.User, "details").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to create notification", function() {
			return _runUpdateIssue({
				notificationCreate: sinon.stub(repositories.Notification, "create").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to send email notification", function() {
			return _runUpdateIssue({
				notificationEmailerIssueUpdated: sinon.stub(notificationEmailer, "issueUpdated").rejects(new Error("oh noes!")),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		function _runUpdateIssue(params) {
			params = params || {};
			params.stubs = {
				mapperMap: params.mapperMap || sinon.stub(mapper, "map").resolves(params.mapperMapResult || { developerId: params.developerId || "the developer id" }),
				issueUpdate: params.issueUpdate || sinon.stub(repositories.Issue, "update").resolves(),
				notificationCreate: params.notificationCreate || sinon.stub(repositories.Notification, "create").resolves(),
				userDetails: params.userDetails || sinon.stub(repositories.User, "details").resolves(params.user || { emailNotificationForIssueUpdated: params.emailNotificationForIssueUpdated == undefined ? true : false }),
				notificationEmailerIssueUpdated: params.notificationEmailerIssueUpdated || sinon.stub(notificationEmailer, "issueUpdated").resolves()
			};

			params.verb = "post";
			params.route = "/issues/update";
			params.request = params.request || {
				user: params.query || {
					_id: params.userId || "the user id"
				}
			};

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("get /issues/download-attached-file", function() {
		it("should set get /issues/download-attached-file route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues/download-attached-file", sinon.match.func, sinon.match.func));
		});

		it("should write retrieved storage value to response", function() {
			var file = {
				container: "the container",
				id: "the id",
				name: "the name"
			};

			return _runDownloadAttachedFile({
				issueFile: file,
				assert: function(results) {
					assert(results.stubs.storageGet.calledWith(file.container, file.id + "-" + file.name, results.response));
				}
			});
		});

		it("should send 500 when failing to get issue file details", function() {
			return _runDownloadAttachedFile({
				issueFileDetails: sinon.stub(repositories.IssueFile, "details").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should send 500 when failing to get file from storage", function() {
			return _runDownloadAttachedFile({
				storageGet: sinon.stub(storage, "get").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			})
		});

		it("should set content type to file name", function() {
			var file = {
				container: "the container",
				id: "the id",
				name: "the name"
			};

			return _runDownloadAttachedFile({
				issueFile: file,
				assert: function(results) {
					assert(results.response.contentType.calledWith(file.name));
				}
			});
		});

		function _runDownloadAttachedFile(params) {
			params = params || {};
			params.stubs = {
				issueFileDetails: params.issueFileDetails || sinon.stub(repositories.IssueFile, "details").resolves(params.issueFile || "details"),
				storageGet: params.storageGet || sinon.stub(storage, "get").resolves(params.storageGetValue || "the storage get value"),
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html || "html-content"),
				mustacheRender: params.mustacheRender || sinon.stub(mustache, "render").returns(params.rendered || "the rendered html")
			};

			params.verb = "get";
			params.route = "/issues/download-attached-file";
			params.request = params.request || {
				query: params.query || {
					id: params.id || "the id"
				}
			};

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("get issues/create", function() {
		it("should set get /issues/create route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues/create", sinon.match.func, sinon.match.func));
		});

		it("should write rendered html from createIssue.html to response", function() {
			var html = "the html";
			var rendered = "the rendered html";
			return _runGetIssueCreate({
				htmlContent: html,
				rendered: rendered,
				assert: function(result) {
					assert(result.response.send.calledWith(rendered));
				}
			});
		});

		it("should send 500 when failing to read createIssue.html", function() {
			var readFile = sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!"));
			return _runGetIssueCreate({
				readFile: readFile,
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to render html", function() {
			var mustacheRender = sinon.stub(mustache, "render").throws();
			return _runGetIssueCreate({
				mustacheRender: mustacheRender,
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should create a new object id and assign to issueId of the rendered html", function() {
			var objectId = "the object id";
			sinon.stub(mongoose.Types, "ObjectId").returns(objectId);

			return _runGetIssueCreate({
				assert: function(result) {
					assert(result.stubs.mustacheRender.calledWith(sinon.match.string, { issueId: objectId }));
					mongoose.Types.ObjectId.restore();
				}
			});
		});

		function _runGetIssueCreate(params) {
			params = params || {};
			params.stubs = {
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.html || "html-content"),
				mustacheRender: params.mustacheRender || sinon.stub(mustache, "render").returns(params.rendered || "the rendered html")
			};

			params.verb = "get";
			params.route = "/issues/create";

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("get /issues/details", function() {
		it("should set get /issues/details route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues/details", sinon.match.func, sinon.match.func));
		});

		it("should get issue details", function() {
			return _runIssueDetails({});
		});

		it("should get comments with user populated", function() {
			return _runIssueDetails({
				assert: function(results) {
					assert(results.stubs.commentIssue.calledWith(sinon.match.any, { populate: "user", sort: sinon.match.any }));
				}
			});
		});

		it("should get comments sorted by date descending", function() {
			return _runIssueDetails({
				assert: function(results) {
					assert(results.stubs.commentIssue.calledWith(sinon.match.any, { populate: sinon.match.any, sort: { date: -1 } }));
				}
			});
		});

		it("should send 500 on when failing to read view", function() {
			return _runIssueDetails({
				readFile: sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get issue by number", function() {
			return _runIssueDetails({
				issueNumber: sinon.stub(repositories.Issue, "number").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get transitions", function() {
			return _runIssueDetails({
				issue: { number: 4 },
				transitionStatus: sinon.stub(repositories.Transition, "status").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get comments", function() {
			return _runIssueDetails({
				commentIssue: sinon.stub(repositories.Comment, "issue").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to get files", function() {
			return _runIssueDetails({
				fileIssue: sinon.stub(repositories.IssueFile, "issue").rejects(new Error("oh noes!")),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 on when failing to map", function() {
			return _runIssueDetails({
				mapperMap: sinon.stub(mapper, "map").throws(),
				assert: function(results) {
					assert(results.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 404 when issue is not found", function() {
			return _runIssueDetails({
				issueNumber: sinon.stub(repositories.Issue, "number").resolves(undefined),
				assert: function(results) {
					assert(results.response.send.calledWith(404));
				}
			});
		});

		it("should map transitions to transition view models", function() {
			var transitions = ["the first"];
			return _runIssueDetails({
				transitions: transitions,
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("transition", "transition-view-model", transitions));
				}
			});
		});

		it("should map comments to comment view models", function() {
			var comments = ["the first"];
			return _runIssueDetails({
				comments: comments,
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("comment", "issue-history-view-model", comments));
				}
			});
		});

		it("should map files to issue file view models", function() {
			var files = ["the first"];
			return _runIssueDetails({
				files: files,
				assert: function(result) {
					assert(result.stubs.mapperMapAll.calledWith("issue-file", "issue-file-view-model", files));
				}
			});
		});

		it("should render issueDetails.html with mapped issue", function() {
			var html = "details-content";
			var renderedHtml = "rendered-details-content";

			var mappedTransitions = [{ name: "the first transition" }, { name: "the second transition" }];
			var mappedComments = [{ name: "the first comment" }, { name: "the second comment" }];
			var mappedFiles = [{ name: "the first file" }, { name: "the second file" }];
			var mappedIssue = { number: 1 };
			var mapAll = sinon.stub(mapper, "mapAll");
			mapAll.withArgs("transition", "transition-view-model", []).returns(mappedTransitions);
			mapAll.withArgs("comment", "issue-history-view-model", []).returns(mappedComments);
			mapAll.withArgs("issue-file", "issue-file-view-model", []).returns(mappedFiles);
			var mustacheRender = sinon.stub(mustache, "render").returns(renderedHtml);
			return _runIssueDetails({
				detailsContent: html,
				mapped: mappedIssue,
				mapperMapAll: mapAll,
				mustacheRender: mustacheRender,
				assert: function() {
					assert(mustacheRender.calledWith(html, sinon.match.any));
				}
			});
		});

		function _runIssueDetails(params) {
			params = params || {};
			params.stubs = {
				readFile: params.readFile || sinon.stub(fs, "readFileAsync").resolves(params.detailsContent || "details-content"),
				issueNumber: params.issueNumber || sinon.stub(repositories.Issue, "number").resolves(params.issue || {}),
				transitionStatus: params.transitionStatus || sinon.stub(repositories.Transition, "status").resolves(params.transitions || []),
				commentIssue: params.commentIssue || sinon.stub(repositories.Comment, "issue").resolves(params.comments || []),
				fileIssue: params.fileIssue || sinon.stub(repositories.IssueFile, "issue").resolves(params.files || []),
				mapperMap: params.mapperMap || sinon.stub(mapper, "map").returns(params.mapped || {}),
				mapperMapAll: params.mapperMapAll || sinon.stub(mapper, "mapAll").returns(params.mapAll || {}),
				mustacheRender: params.mustacheRender || sinon.stub(mustache, "render").returns(params.rendered || "the rendered html")
			};

			params.verb = "get";
			params.route = "/issues/details";
			params.request = {
				query: {
					projectId: params.projectId || "the project id"
				}
			};

			return _run(params).finally(function() {
				for (var name in params.stubs)
					params.stubs[name].restore();
			});
		}
	});

	describe("get issues/list", function() {
		it("should set get /issues/list route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues/list", sinon.match.func, sinon.match.func));
		});

		it("should send 500 when failing to retrieve issues", function() {
			sinon.stub(repositories.Issue, "search").rejects(new Error("oh noes!"));

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
					repositories.Issue.search.restore();
				}
			}).finally(function() {

			});
		});

		it("should send 500 when failing to map issues", function() {
			sinon.stub(repositories.Issue, "search").resolves(["blah"]);
			sinon.stub(mapper, "mapAll").throws();

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 500));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
				mapper.mapAll.restore();
			});
		});

		it("should set start to 1 when invalid start given", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			request.query.start = "not a number";
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, 1, parseInt(request.query.end)));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		it("should set end to 50 when invalid start given", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			request.query.end = "not a number";
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, parseInt(request.query.start), 50));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		it("should map issues to view models", function() {
			sinon.stub(repositories.Issue, "search").resolves(["blah"]);
			sinon.stub(mapper, "mapAll").returns([]);

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(mapper.mapAll.calledWith("issue", "issue-view-model", ["blah"]));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
				mapper.mapAll.restore();
			});
		});

		it("should search for issues", function() {
			sinon.stub(repositories.Issue, "search").resolves([]);

			var request = _buildDefaultRequest();
			return _run({
				request: request,
				verb: "get",
				route: "/issues/list",
				assert: function(result) {
					assert(repositories.Issue.search.calledWith({
						priorities: request.query.priorities.split(","),
						statuses: request.query.statuses.split(","),
						milestones: request.query.milestones.split(","),
						developers: request.query.developers.split(","),
						testers: request.query.testers.split(","),
						types: request.query.types.split(",")
					}, request.query.direction, request.query.comparer, parseInt(request.query.start), parseInt(request.query.end)));
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			}).finally(function() {
				repositories.Issue.search.restore();
			});
		});

		function _buildDefaultRequest() {
			return {
				query: {
					start: "1",
					end: "50",
					priorities: "priority1",
					statuses: "status1",
					milestones: "milestone1",
					developers: "developer1",
					testers: "tester1",
					types: "type1",
					direction: "ascending",
					comparer: "priority"
				}
			};
		}
	});

	describe("get /issues", function() {
		it("should set get /issues route", function() {
			var app = { get: sinon.stub(), post: sinon.stub() };
			sut(app);
			assert(app.get.calledWith("/issues", sinon.match.func, sinon.match.func));
		});

		it("should read issues.html file contents", function() {
			var content = "issues.html content";
			sinon.stub(fs, "readFileAsync").resolves(content);

			return _run({
				verb: "get",
				route: "/issues",
				assert: function() { assert(fs.readFileAsync.calledWith("public/views/issues.html")); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});

		it("should send contents of issues.html via response", function() {
			var content = "issues.html content";
			sinon.stub(fs, "readFileAsync").resolves(content);

			return _run({
				verb: "get",
				route: "/issues",
				assert: function(stubs) { assert(stubs.response.send.calledWith(content)); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});

		it("should send 500 and error message on error", function() {
			sinon.stub(fs, "readFileAsync").rejects(new Error("oh noes!"));

			return _run({
				verb: "get",
				route: "/issues",
				assert: function(stubs) { assert(stubs.response.send.calledWith(sinon.match.string, 500)); }
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		});
	});

	function _run(params) {
		var func;
		var request = params.request || sinon.stub(), response = { send: sinon.stub(), contentType: sinon.stub() };
		var app = {
			get: function(route, b, c) {
				if (params.verb == "get" && route == params.route)
					if (c) func = c; else func = b;
			},
			post: function(route, b, c) {
				if (params.verb == "post" && route == params.route)
					if (c) func = c; else func = b;
			}
		};

		sut(app);
		return func(request, response).finally(function() {
			if (params.assert)
				params.assert({ request: request, response: response, stubs: params.stubs });
		});
	}
});