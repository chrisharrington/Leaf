
function FailedDeferred() {
	var deferred = new $.Deferred();
	deferred.reject();
	return deferred.promise();
}