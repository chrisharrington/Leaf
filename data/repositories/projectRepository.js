var repository = Object.spawn(require("./baseRepository"), {
	type: "projects",
	index: "all"
});

//repository.one = function() {
//	return this.client.search({
//		index: "all",
//		type: "projects",
//		body: {
//			query: {
//				bool: {
//					must: [
//						{
//							term: {
//								"formattedName": "leaf"
//							}
//						}
//					]
//				}
//			}
//		}
//	}).then(function(result) {
//		return result.hits.hits[0]._source;
//	});
//};

module.exports = repository;