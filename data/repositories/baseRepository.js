var Promise = require("bluebird");

exports.all = function(model, options) {
	return new Promise(function(resolve, reject) {
		var query = model.find();
		if (options.sort)
			query = query.sort(options.sort);
		if (options.where)
			query = _applyFilter(query, options.where);
		if (options.limit)
			query = query.limit(options.limit);
		if (options.skip)
			query = query.skip(options.skip);
		query.exec(function(err, result) {
			if (err) {
				console.log("Error while retrieving all: " + err);
				reject(err);
			} else {
				resolve(result);
			}
		})
	});
};

function _applyFilter(query, wheres) {
	if (!wheres.length)
		wheres = [wheres];
	for (var i = 0; i < wheres.length; i++)
		query = query.where(wheres[i]);
	return query;
}