var Promise = require("bluebird");

module.exports = {
	all: function() {
		var me = this;
		return new Promise(function(resolve, reject) {
			var query = me.model.find();
			if (me.sort)
				query = query.sort(me.sort);
			if (me.where)
				query = _applyFilter(query, me.where);
			if (me.limit)
				query = query.limit(me.limit);
			if (me.skip)
				query = query.skip(me.skip);
			query.exec(function(err, result) {
				if (err) {
					console.log("Error while retrieving all: " + err);
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},

	details: function(id) {
		return this.model.findOneAsync({ "_id": id });
	}
};

function _applyFilter(query, wheres) {
	if (!wheres.length)
		wheres = [wheres];
	for (var i = 0; i < wheres.length; i++)
		query = query.where(wheres[i]);
	return query;
}