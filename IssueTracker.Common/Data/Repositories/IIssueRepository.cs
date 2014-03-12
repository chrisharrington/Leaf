using System;
using System.Collections.Generic;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;
using Issue = IssueTracker.Common.Models.Issue;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IIssueRepository : IBaseProjectRepository<Issue>
	{
		IEnumerable<Issue> Search(Search search, Sort sort);
		int HighestNumber(Project project);
		Issue ProjectAndNumber(Guid projectId, int number);
	}
}