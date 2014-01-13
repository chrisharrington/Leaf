using System.Collections.Generic;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Data.Repositories
{
	public class IssueRepository : BaseRepository<Issue>, IIssueRepository
	{
		public IEnumerable<Issue> Search(Search search, Sort sort)
		{
			var issues = (IEnumerable<Issue>) Context.Issues.Include("Assignee").Include("Owner").Include("Priority").Include("Status");
			ApplyFilter(ref issues, search);
			ApplySort(ref issues, sort);
			return issues.Skip(search.start - 1).Take(search.end - search.start + 1);
		}

		private void ApplySort(ref IEnumerable<Issue> issues, Sort sort)
		{
			if (sort.Direction == SortDirection.Ascending)
				issues = issues.OrderBy(sort.Comparer);
			else if (sort.Direction == SortDirection.Descending)
				issues = issues.OrderByDescending(sort.Comparer);
		}

		private void ApplyFilter(ref IEnumerable<Issue> issues, Search search)
		{
			if (search.priority != null)
				issues = issues.Where(x => x.Priority.Id == search.priority.Id);
			if (search.status != null)
				issues = issues.Where(x => x.Status.Id == search.status.Id);
			if (search.assignee != null)
				issues = issues.Where(x => x.Assignee.Id == search.assignee.Id);
			if (search.owner != null)
				issues = issues.Where(x => x.Owner.Id == search.owner.Id);
		}
	}
}