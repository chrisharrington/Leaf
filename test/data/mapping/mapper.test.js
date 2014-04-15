var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../setup");

var fs = Promise.promisifyAll(require("fs"));

var sut = require("../../../data/mapping/mapper");

describe("mapper", function() {
	describe("define", function() {
		it("should add a definition", function() {
			sut.define("source", "destination", "definition");
			assert(Object.keys(sut.maps).length == 1);
		});

		it("should have key that combines the source and destination with a pipe", function() {
			var source = "source", dest = "destination";
			sut.define(source, dest, "definition");
			assert(Object.keys(sut.maps)[0] == source + "|" + dest);
		});

		it("should add the given definition", function() {
			var source = "source", dest = "destination", definition = { id: "the_id", name: "the_name" };
			sut.define(source, dest, definition);

			var maps = sut.maps;
			assert(maps[Object.keys(maps)] == definition);
		});

		afterEach(function() {
			sut.maps = {};
		});
	});

	describe("map", function() {
		it("should reject when no source given", function() {
			var message;
			return _run().catch(function(e) {
				message = e;
			}).finally(function() {
				assert(message == "Missing source while mapping.");
			});
		});

		it("should reject when no mapping definition found", function() {
			var message;
			return _run({
				source: {},
				sourceKey: "source",
				destinationKey: "destination"
			}).catch(function(e) {
				message = e;
			}).finally(function() {
				assert(message == "No such mapping definition for \"source|destination\"");
			});
		});

		it("should map all properties", function() {
			sut.maps = { "source|destination": { id: "the-id", name: "the-name" } };
			var source = { "the-id": 12345, "the-name": "boogity!" };

			return sut.map("source", "destination", source).then(function(mapped) {
				assert(mapped.id == source["the-id"]);
				assert(mapped.name == source["the-name"]);
			});
		});

		it("should execute defined functions", function() {
			sut.maps = { "source|destination": { id: "the-id", name: "the-name", formattedName: function(m) { return m["the-name"].toUpperCase(); } } };
			var source = { "the-id": 12345, "the-name": "boogity!" };

			return sut.map("source", "destination", source).then(function(mapped) {
				assert(mapped.formattedName == source["the-name"].toUpperCase());
			});
		});

		function _run(params) {
			params = params || {};
			return sut.map(params.sourceKey || "", params.destinationKey || "", params.source);
		}
	});

	describe("mapAll", function() {
		it("should call 'map' for every object given", function() {
			var sourceKey = "the source key";
			var destinationKey = "the destination key";
			var first = { name: "the first" };
			var second = { name: "the second" };

			var map = sinon.stub(sut, "map").resolves();
			return sut.mapAll(sourceKey, destinationKey, [first, second]).then(function() {
				assert(map.calledWith(sourceKey, destinationKey, first));
				assert(map.calledWith(sourceKey, destinationKey, second));
			}).finally(function() {
				map.restore();
			});
		});
	});

	describe("init", function() {
		var _define;

		beforeEach(function() {
			_define = sinon.stub(sut, "define").resolves();
		});

		it("should define priority/priority-view-model map", function() {
			return sut.init().then(function() {
				assert(_define.calledWith("priority", "priority-view-model", {
					"id": "_id",
					name: "name",
					order: "order"
				}));
			});
		});

		it("should define comment/issue-history-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("comment", "issue-history-view-model", {
					date: sinon.match.func,
					text: "text",
					user: sinon.match.func,
					issueId: sinon.match.func
				}));
			});
		});

		it("should define issue-history-view-model/comment map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("issue-history-view-model", "comment", {
					date: sinon.match.func,
					text: "text"
				}));
			});
		});

		it("should define issue/issue-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("issue", "issue-view-model", {
					id: "_id",
					description: "name",
					details: "details",
					number: "number",
					milestone: "milestone",
					milestoneId: "milestoneId",
					priority: "priority",
					priorityId: "priorityId",
					status: "status",
					statusId: "statusId",
					tester: "tester",
					testerId: "testerId",
					developer: "developer",
					developerId: "developerId",
					type: "type",
					typeId: "typeId",
					priorityStyle: sinon.match.func,
					opened: sinon.match.func,
					closed: sinon.match.func,
					lastUpdated: sinon.match.func,
					updatedBy: "updatedBy"
				}));
			});
		});

		it("should define issue-view-model/issue map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("issue-view-model", "issue", {
					"_id": "id",
					name: "description",
					details: "details",
					number: "number",
					milestone: "milestone",
					milestoneId: "milestoneId",
					priority: "priority",
					priorityId: "priorityId",
					status: "status",
					statusId: "statusId",
					tester: "tester",
					testerId: "testerId",
					developer: "developer",
					developerId: "developerId",
					type: "type",
					typeId: "typeId",
					opened: sinon.match.func,
					closed: sinon.match.func
				}));
			});
		});

		it("should define issue-file/issue-file-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("issue-file", "issue-file-view-model", {
					"id": "_id",
					name: "name",
					size: sinon.match.func
				}));
			});
		});

		it("should define issue-type/issue-type-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("issue-type", "issue-type-view-model", {
					"id": "_id",
					name: "name"
				}));
			});
		});

		it("should define milestone/milestone-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("milestone", "milestone-view-model", {
					"id": "_id",
					name: "name"
				}));
			});
		});

		it("should define milestone/milestone-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("notification", "notification-view-model", {
					id: "_id",
					type: "type",
					isViewed: "isViewed",
					comment: sinon.match.func,
					issue: sinon.match.func
				}));
			});
		});

		it("should define priority/priority-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("priority", "priority-view-model", {
					"id": "_id",
					name: "name",
					order: "order"
				}));
			});
		});

		it("should define project/project-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("project", "project-view-model", {
					"id": "_id",
					name: "name"
				}));
			});
		});

		it("should define status/status-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("status", "status-view-model", {
					"id": "_id",
					name: "name",
					order: "order"
				}));
			});
		});

		it("should define transition/transition-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("transition", "transition-view-model", {
					"id": "_id",
					name: "name"
				}));
			});
		});

		it("should define user/user-view-model map", function() {
			var cache = require.cache;
			return sut.init().then(function() {
				assert(_define.calledWith("user", "user-view-model", {
					"id": "_id",
					name: "name",
					emailAddress: "emailAddress",
					emailNotificationForIssueAssigned: "emailNotificationForIssueAssigned",
					emailNotificationForIssueUpdated: "emailNotificationForIssueUpdated",
					emailNotificationForIssueDeleted: "emailNotificationForIssueDeleted",
					emailNotificationForNewCommentForAssignedIssue: "emailNotificationForNewCommentForAssignedIssue"
				}));
			});
		});

		afterEach(function() {
			_define.restore();

			var path = process.cwd() + "/data/mapping/definitions";
			return fs.readdirAsync(path).then(function(files) {
				return Promise.map(files, function(file) {
					require.cache[path + "/" + file] = null;
				});
			});
		});
	});
});