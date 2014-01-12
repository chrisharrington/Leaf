using System.Collections.Generic;
using System.Linq;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class IssueRepository : BaseRepository<Issue>, IIssueRepository
	{
		public IEnumerable<Issue> Search()
		{
			using (var connection = OpenConnection())
			{
				return connection.Query<Issue>("select * from Issues").OrderBy(x => x.Number);
			}
		}
	}
}