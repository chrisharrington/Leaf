using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IIssueRepository : IRepository<Issue>
	{
		IEnumerable<Issue> Search(int start, int end, Priority priority, Status status);
	}
}