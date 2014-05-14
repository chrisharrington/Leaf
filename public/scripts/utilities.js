(function (root) {

	root.createPropertyObservables = function (obj) {
		for (var name in obj)
			obj[name] = ko.observable(obj[name]);
		return obj;
	};

	root.extractPropertyObservableValues = function (obj) {
		var values = {};
		for (var name in obj) {
			if (typeof (obj[name]) === "function")
				values[name] = obj[name]();
		}
		return values;
	};

	root.extractPropertyObservableValuesFromArray = function (array) {
		var result = [];
		for (var i = 0; i < array.length; i++)
			result.push(this.extractPropertyObservableValues(array[i]));
		return result;
	};

	root.setObservableProperties = function(source, destination) {
		if (!source || !destination)
			return;

		for (var name in source)
			destination[name](source[name]);
	};

	root.copyNestedObservableObject = function (source, destination) {
		if (!destination)
			destination = {};
		for (var name in source) {
			if (!destination[name])
				destination[name] = ko.observable(typeof (source[name]) == typeof (Function) ? source[name]() : source[name]);
			else
				destination[name](typeof(source[name]) == typeof(Function) ? source[name]() : source[name]);
		}
		return destination;
	};

	root.buildObservableArray = function(array) {
		var oa = ko.observableArray();
		$.each(array, function(i, current) {
			oa.push(root.createPropertyObservables(current));
		});
		return oa;
	};

	root.getUserProfileImageLocation = function(userId, size) {
		if (!userId)
			userId = IssueTracker.signedInUser().id();
		if (typeof (userId) === "Function")
			userId = userId();

		var email;
		$.each(IssueTracker.users(), function(i, user) {
			if (user.id() == userId)
				email = user.emailAddress();
		});
		return "http://gravatar.com/avatar/" + CryptoJS.MD5(email) + "?s=" + (size || 35) +"&d=mm";
	};

	root.getPriorityColour = function(priorityId) {
		var colour;
		$.each(IssueTracker.priorities(), function(i, priority) {
			if (priority.id() == priorityId)
				colour = priority.colour();
		});
		return colour;
	}

})(root("IssueTracker.Utilities"));