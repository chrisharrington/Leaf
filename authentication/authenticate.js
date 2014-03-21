module.exports = function(request, response, next) {
	if (!request.cookies.staySignedIn || request.cookies.staySignedIn != "true")
		response.send(401);
	else
		next();
};