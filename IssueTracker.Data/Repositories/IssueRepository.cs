using System;
using System.Collections.Generic;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class IssueRepository : BaseRepository<Issue>, IIssueRepository
	{
		public IEnumerable<Issue> Search(int start, int end, Priority priority, Status status)
		{
			if (end < 1)
				throw new ArgumentOutOfRangeException("end");

			var issues = (IEnumerable<Issue>) Context.Issues.Include("Assignee").Include("Owner").Include("Priority").Include("Status");
			if (priority != null)
				issues = issues.Where(x => x.Priority.Id == priority.Id);
			if (status != null)
				issues = issues.Where(x => x.Status.Id == status.Id);
			return issues.OrderBy(x => x.Number).Skip(start-1).Take(end-start+1);
		}
	}
}