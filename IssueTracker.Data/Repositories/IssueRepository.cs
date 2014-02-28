using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Data.Repositories
{
	public class IssueRepository : BaseProjectRepository<Issue>, IIssueRepository
	{
		public IEnumerable<Issue> Search(Search search, Sort sort)
		{
			var issues = (IEnumerable<Issue>) Context.Issues.Include("Developer").Include("Tester").Include("Priority").Include("Status").Include("Project");
			ApplyFilter(ref issues, search);
			ApplySort(ref issues, sort);
			return issues.Where(x => !x.IsDeleted).Skip(search.start - 1).Take(search.end - search.start + 1);
		}

		public int HighestNumber(Project project)
		{
			var issue = Context.Issues.Where(x => x.Project.Id == project.Id).OrderByDescending(x => x.Number).FirstOrDefault();
			return issue == null ? 0 : issue.Number;
		}

		public override void Update(Issue model, User user)
		{
			var retrieved = Details(model.Id);
			var changes = new List<Audit>();
			var oldProperties = retrieved.GetType().GetProperties().ToDictionary(x => x.Name);
			var newProperties = model.GetType().GetProperties().ToDictionary(x => x.Name);
			foreach (var key in oldProperties.Keys)
			{
				if (key == "Audits")
					continue;

				var oldValue = oldProperties[key].GetValue(retrieved);
				var newValue = newProperties[key].GetValue(model);
				if (oldValue != null && !oldValue.Equals(newValue))
					changes.Add(new Audit { Id = Guid.NewGuid(), OldValue = oldValue.ToString(), NewValue = newValue.ToString(), Property = key });
			}
			SetProperties(model, retrieved);
			var issueAudit = new IssueAudit { Id = Guid.NewGuid(), Changes = changes, Date = DateTime.UtcNow, User = user, Issue = retrieved};
			model.Audits.Add(issueAudit);
			Context.SaveChanges();
		}

		private void ApplySort(ref IEnumerable<Issue> issues, Sort sort)
		{
			if (sort.direction == SortDirection.Ascending)
				issues = issues.OrderBy(sort.GetComparerFunction()).ThenBy(x => x.Opened);
			else if (sort.direction == SortDirection.Descending)
				issues = issues.OrderByDescending(sort.GetComparerFunction()).ThenBy(x => x.Opened);
		}

		private void ApplyFilter(ref IEnumerable<Issue> issues, Search search)
		{
			issues = issues.Where(x => x.Project.Id == search.project.Id);
			if (search.milestones.Any())
				issues = issues.Where(x => search.milestones.Select(y => y.Id).Contains(x.Milestone.Id));
			if (search.priorities.Any())
				issues = issues.Where(x => search.priorities.Select(y => y.Id).Contains(x.Priority.Id));
			if (search.statuses.Any())
				issues = issues.Where(x => search.statuses.Select(y => y.Id).Contains(x.Status.Id));
			if (search.developers.Any())
				issues = issues.Where(x => search.developers.Select(y => y.Id).Contains(x.Developer.Id));
			if (search.testers.Any())
				issues = issues.Where(x => search.testers.Select(y => y.Id).Contains(x.Tester.Id));
			if (search.status != null)
				issues = issues.Where(x => x.Status.Id == search.status.Id);
			if (search.developer != null)
				issues = issues.Where(x => x.Developer.Id == search.developer.Id);
			if (search.tester != null)
				issues = issues.Where(x => x.Tester.Id == search.tester.Id);
			if (!string.IsNullOrEmpty(search.filter))
			{
				search.filter = search.filter.Trim().ToLower();
				issues = issues.Where(x =>
					x.Name.ToLower().Trim().Contains(search.filter) || x.Comments.Trim().ToLower().Contains(search.filter) ||
					x.Status.ToString().Trim().ToLower().Contains(search.filter) || x.Priority.ToString().Contains(search.filter) ||
					x.Developer.ToString().Trim().ToLower().Contains(search.filter) ||
					x.Tester.ToString().Trim().ToLower().Contains(search.filter));
			}
		}
	}
}