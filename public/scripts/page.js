var IssueTracker = window.IssueTracker || {};

IssueTracker.Page = function(params) {
	this._validateParams(params);

	var me = this;
	params.root.route = params.route;
	params.root.navigate = function(routeParameters) { me.navigate(params.route[0], routeParameters || {}); };
	this.load = params.root.load;
	this.init = params.root.init;
	this.preload = params.root.preload;

	if (!(params.route instanceof Array))
		params.route = [params.route];

	$.each(params.route, function() {
		Path.map(this).to(function () {
			if (!me._isAuthorized(params))
				IssueTracker.Welcome.redirect();
			else
				me._setView(params, this.params);
		}).enter(function() {
			if (params.root.enter)
				params.root.enter();
		}).exit(function () {
			if (params.unload)
				params.unload();
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
	return IssueTracker.signedInUser() != null;
};

IssueTracker.Page.prototype._setView = function (params, routeArguments) {
	this._resetErrorPanels();

	var me = this;
	var url = params.view;
	if (url instanceof Function)
		url = url();
	for (var name in routeArguments)
		url = url.replace(":" + name, routeArguments[name].replace(/-/g, " "));

	if (me.preload)
		me.preload(routeArguments);

	$.get(url).then(function(html) {
		var container = $(".content-container")
			.attr("class", "content-container " + params.style)
			.empty()
			.append($("<div></div>").addClass("binding-container").html(html));
		ko.applyBindings(params.root, container.find(">div.binding-container")[0]);

		if (me.init && !me._initFired) {
			me.init(container);
			me._initFired = true;
		}
		if (me.load)
			me.load(container, routeArguments);
		me._setTitle(params.title);
		$(document).scrollTop();
	});
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
	if (!params.route)
		throw new Error("Missing page route.");
	if (!params.style)
		throw new Error("Missing page style.");
};

IssueTracker.Page.prototype._setTitle = function(title) {
	if (!title)
		title = "Leaf";
	if (typeof(title) == "function")
		title = title();
	document.title = title;
	IssueTracker.title(title);
};

IssueTracker.Page.prototype._resetErrorPanels = function() {
	$("div.error-code").hide();
	$("section.content-container").show();
};