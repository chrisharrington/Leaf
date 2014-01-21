
IssueTracker.Page = function(params) {
	this._validateParams(params);

	var me = this;
	params.root.route = params.route;
	params.root.navigate = function(routeParameters) { me.navigate(params.route[0], routeParameters || {}); };
	this.load = params.root.load;
	this.init = params.root.init;

	if (!(params.route instanceof Array))
		params.route = [params.route];

	$.each(params.route, function() {
		Path.map(this).to(function () {
			if (!me._isAuthorized(params))
				IssueTracker.Welcome.navigate();
			else
				me._setView(params, this.params);
		});
	});

	return this;
};

IssueTracker.Page.build = function(params) {
	return new IssueTracker.Page(params);
};

IssueTracker.Page.prototype.navigate = function (route, params) {
	route = route ? route : this.route;
	for (var name in params)
		route = route.replace(":" + name, params[name]);
	window.location.hash = route;
};

IssueTracker.Page.prototype._isAuthorized = function (params) {
	if (params.isAnonymous)
		return true;
	
	for (var i = 0; i < params.route.length; i++)
		if (params.route[0].startsWith("#/welcome") || params.route[0].startsWith("#/verify"))
			return true;

	return !IssueTracker.isUnauthorized();
};

IssueTracker.Page.prototype._setView = function (params, routeArguments) {
	var me = this;
	var url = params.view;
	if (url instanceof Function)
		url = url();
	for (var name in routeArguments)
		url = url.replace(":" + name, routeArguments[name].replace(/-/g, " "));
	
	IssueTracker.view({ url: url, style: params.style, data: params.root, load: function() {
		var container = $(".content-container");
		if (me.init && !me._initFired) {
			me.init(container);
			me._initFired = true;
		}
		if (me.load)
			me.load($(".content-container"), routeArguments);
	} });
	IssueTracker.title(params.title);
};

IssueTracker.Page.prototype._loadData = function() {
	var deferred = new $.Deferred();
	deferred.resolve({});
	return deferred.promise();
};

IssueTracker.Page.prototype._validateParams = function(params) {
	if (!params)
		throw new Error("Missing page parameters.");
	if (!params.root)
		throw new Error("Missing page root parameter.");
	if (!params.view)
		throw new Error("Missing page view.");
	if (!params.title)
		throw new Error("Missing page title.");
	if (!params.route)
		throw new Error("Missing page route.");
	if (!params.style)
		throw new Error("Missing page style.");
};