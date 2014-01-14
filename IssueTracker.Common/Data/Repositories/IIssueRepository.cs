using System.Collections.Generic;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IIssueRepository : IBaseProjectRepository<Issue>
	{
		IEnumerable<Issue> Search(Search search, Sort sort);
	}
}