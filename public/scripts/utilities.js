(function (root) {

	root.createPropertyObservables = function (obj) {
		for (var name in obj)
			obj[name] = ko.observable(obj[name]);
		return obj;
	};

	root.extractPropertyObservableValues = function (obj) {
		var values = {};
		for (var name in obj)
			values[name] = obj[name]();
		return values;
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

	root.getUserProfileImageLocation = function(userId, size) {
		var email;
		$.each(IssueTracker.users(), function(i, user) {
			if (user.id == userId)
				email = user.emailAddress;
		});
		return "http://gravatar.com/avatar/" + CryptoJS.MD5(email) + "?s=" + (size || 35) +"&d=mm";
	};

})(root("IssueTracker.Utilities"));