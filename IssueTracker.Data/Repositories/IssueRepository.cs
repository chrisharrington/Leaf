using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class IssueRepository : BaseRepository<Issue>, IIssueRepository
	{
		public IEnumerable<Issue> Search(int start, int count)
		{
			if (count < 1)
				throw new ArgumentOutOfRangeException("count");

			using (var connection = OpenConnection())
			{
				return connection.Query<Issue>("select * from (select Id, Name, Number, Description, OwnerId, AssigneeId, PriorityId, StatusId, Opened, Closed, ROW_NUMBER() over (order by Number) as RowNumber from Issues) as SubISsues where SubIssues.RowNumber between " + start + " and " + (start+count));
			}
		}
	}
}