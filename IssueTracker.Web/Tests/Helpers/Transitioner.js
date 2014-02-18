
describe("Transitioner", function() {

	var _transitioner = IssueTracker.Transitioner;
	var _statusId = guid();
	var _transitionId = guid();
	var _transitions = [_buildTransition({ id: _transitionId, toId: _statusId, name: "the first transition" }), _buildTransition({ fromId: _statusId, name: "the second transition" }), _buildTransition({ fromId: _statusId, name: "the third transition" })];
	var _statuses = [{ id: _transitions[0].toId, name: "the first status name" }, { id: _statusId, name: "the second status description" }, { id: _transitions[2].fromId, name: "the third status description" }];

	function _buildTransition(params) {
		params = params || {};
		return { id: params.id ? params.id : guid(), toId: params.toId ? params.toId : guid(), fromId: params.fromId ? params.fromId : guid(), name: params.name ? params.name : "the description" };
	}

	beforeEach(function() {
		IssueTracker.transitions = ko.observableArray(_transitions);
		IssueTracker.statuses = ko.observableArray(_statuses);
		IssueTracker.selectedIssue = {
			status: ko.observable(),
			statusId: ko.observable(),
			transitions: ko.observableArray()
		};
	});

	describe("execute", function() {
		it("should fail with invalid transition ID", function() {
			expect(function() { _transitioner.execute(); }).toThrow("Missing transitioner ID.");
		});

		it("should fail with no corresponding transition for transition ID", function () {
			var transitionId = "5848393";
			expect(function() { _transitioner.execute(transitionId); }).toThrow("No transition found for transition ID \"" + transitionId + "\".");
		});

		it("should fail with no corresponding status for status ID", function () {
			var statusId = _transitions[0].toId;
			IssueTracker.statuses = ko.observableArray();
			expect(function() { _transitioner.execute(_transitionId); }).toThrow("No status was found with status ID \"" + statusId + "\".");
		});

		it("should set status", function() {
			_transitioner.execute(_transitionId);
			expect(IssueTracker.selectedIssue.status()).toEqual(_statuses[0].name);
			expect(IssueTracker.selectedIssue.statusId()).toEqual(_statuses[0].id);
		});

		it("should set next transitions", function() {
			_transitioner.execute(_transitionId);

			var transitions = IssueTracker.selectedIssue.transitions();
			expect(transitions.length).toEqual(2);
			expect(transitions[0].name).toEqual(_transitions[1].name);
			expect(transitions[1].name).toEqual(_transitions[2].name);
		});
	});

});