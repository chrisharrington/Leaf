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
			var issues = (IEnumerable<Issue>) Context.Issues.Include("Assignee").Include("Owner").Include("Priority").Include("Status").Include("Project");
			ApplyFilter(ref issues, search);
			ApplySort(ref issues, sort);
			return issues.Skip(search.start - 1).Take(search.end - search.start + 1);
		}

		private void ApplySort(ref IEnumerable<Issue> issues, Sort sort)
		{
			if (sort.direction == SortDirection.Ascending)
				issues = issues.OrderBy(sort.GetComparerFunction());
			else if (sort.direction == SortDirection.Descending)
				issues = issues.OrderByDescending(sort.GetComparerFunction());
		}

		private void ApplyFilter(ref IEnumerable<Issue> issues, Search search)
		{
			issues = issues.Where(x => x.Project.Id == search.project.Id);
			if (search.priority != null)
				issues = issues.Where(x => x.Priority.Id == search.priority.Id);
			if (search.status != null)
				issues = issues.Where(x => x.Status.Id == search.status.Id);
			if (search.assignee != null)
				issues = issues.Where(x => x.Assignee.Id == search.assignee.Id);
			if (search.owner != null)
				issues = issues.Where(x => x.Owner.Id == search.owner.Id);
			if (!string.IsNullOrEmpty(search.filter))
			{
				search.filter = search.filter.Trim().ToLower();
				issues = issues.Where(x =>
					x.Name.ToLower().Trim().Contains(search.filter) || x.Description.Trim().ToLower().Contains(search.filter) ||
					x.Status.ToString().Trim().ToLower().Contains(search.filter) || x.Priority.ToString().Contains(search.filter) ||
					x.Assignee.ToString().Trim().ToLower().Contains(search.filter) ||
					x.Owner.ToString().Trim().ToLower().Contains(search.filter));
			}
		}
	}
}