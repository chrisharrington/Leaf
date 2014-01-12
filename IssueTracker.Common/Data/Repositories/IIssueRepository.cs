using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IIssueRepository : IRepository<Issue>
	{
		IEnumerable<Issue> Search();
	}
}