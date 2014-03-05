using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Extensions;
using IssueTracker.Common.Models;
using IssueTracker.Common.Models.Base;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Web.Controllers
{
    public class IssuesController : BaseController
    {
		public IStatusRepository StatusRepository { get; set; }
		public IPriorityRepository PriorityRepository { get; set; }
		public IIssueRepository IssueRepository { get; set; }
		public IIssueAuditRepository IssueAuditRepository { get; set; }
		public ITransitionRepository TransitionRepository { get; set; }

		public ActionResult Index()
		{
			return View();
		}

	    public ActionResult Create()
	    {
		    return View();
	    }

		[HttpPost]
	    public void Create(IssueViewModel issue)
		{
			issue.id = Guid.NewGuid();
			issue.number = IssueRepository.HighestNumber(CurrentProject) + 1;
			issue.opened = DateTime.UtcNow.ToApplicationString();
			issue.updated = issue.opened;
			issue.updatedBy = SignedInUser.Name;
			issue.updatedId = SignedInUser.Id;

			Validate(issue);

			var model = Mapper.Map<IssueViewModel, Issue>(issue);
			model.Project = CurrentProject;
			IssueRepository.Insert(model, SignedInUser);
		}

	    public ActionResult Details(string issueName, Guid projectId)
	    {
		    var issue = IssueRepository.ProjectAndName(projectId, issueName);
		    return View(new IssueViewModel {
				id = issue.Id,
			    number = issue.Number,
				description = issue.Name,
				priority = issue.Priority.ToString(),
				priorityId = issue.Priority.Id,
				status = issue.Status.ToString(),
				statusId = issue.Status.Id,
				type = issue.Type.ToString(),
				typeId = issue.Type.Id,
				developer = issue.Developer.ToString(),
				developerId = issue.Developer.Id,
				tester = issue.Tester.ToString(),
				testerId = issue.Tester.Id,
				milestone = issue.Milestone.ToString(),
				milestoneId = issue.Milestone.Id,
				details = issue.Details,
				opened = issue.Opened.ToApplicationString(),
				closed = issue.Closed.ToApplicationString(),
				updatedId = issue.UpdatedBy.Id,
				updated = issue.Updated.ToApplicationString(),
				transitions = TransitionRepository.Status(issue.Status).Select(x => new {id = x.Id, name = x.Name, fromId = x.From.Id, toId = x.To.Id}),
				history = BuildIssueHistory(issue.Audits, issue.Comments)
		    });
	    }

	    public ActionResult Next(IssueParams parameters)
	    {
		    var sort = parameters.BuildSort();
		    if (sort.comparer == null)
			    sort = new Sort {direction = SortDirection.Descending, comparer = "priority"};

			return Json(IssueRepository.Search(parameters.BuildSearch(), sort).Select(x => new {
				id = x.Id,
				number = x.Number,
				name = x.Name,
				description = x.Details,
				milestone = x.Milestone.ToString(),
				priority = x.Priority.ToString(),
				tester = x.Tester.ToString(),
				developer = x.Developer.ToString(),
				status = x.Status.ToString(),
				type = x.Type.ToString(),
				priorityStyle = ToPriorityStyleString(x.Priority),
				opened = x.Opened.ToApplicationString(),
				closed = x.Closed.ToApplicationString(),
				lastUpdated = x.Updated.ToLongApplicationString(),
				updatedBy = x.UpdatedBy.ToString()
			}), JsonRequestBehavior.AllowGet);
	    }

	    [HttpPost]
	    public void Update(IssueViewModel issue)
	    {
		    if (issue == null || issue.id == Guid.Empty)
			    throw new ArgumentNullException("issue");

			issue.updated = DateTime.UtcNow.ToApplicationString();
			issue.updatedId = SignedInUser.Id;
			
		    var model = Mapper.Map<IssueViewModel, Issue>(issue);
		    model.Project = CurrentProject;
			IssueRepository.Update(model, SignedInUser);
	    }

	    [HttpPost]
	    public void ExecuteTransition(Guid issueId, Guid statusId)
	    {
		    var issue = IssueRepository.Details(issueId);
		    var status = StatusRepository.Details(statusId);
		    issue.Status = status;
			IssueRepository.Update(issue, SignedInUser);
	    }

	    [HttpPost]
	    public void Delete(IssueViewModel issue)
	    {
			IssueRepository.Delete(Mapper.Map<IssueViewModel, Issue>(issue), SignedInUser);
	    }

	    [HttpPost]
	    public void AddComment(IssueHistoryViewModel model)
	    {
		    var issue = IssueRepository.Details(model.issueId);
			issue.Comments.Add(new IssueComment { User = SignedInUser, Date = DateTime.UtcNow, Id = Guid.NewGuid(), Issue = issue, Text = model.text });
		    IssueRepository.Update(issue, SignedInUser);
	    }

	    private static string ToPriorityStyleString(NameModel priority)
	    {
		    return priority.Name.Replace(" ", "-").ToLower();
	    }

		private IEnumerable<IssueHistoryViewModel> BuildIssueHistory(IEnumerable<IssueAudit> audits, IEnumerable<IssueComment> comments)
		{
			var history = new List<IssueHistoryViewModel>();
			if (audits != null)
				history.AddRange(audits.Select(x => new IssueHistoryViewModel { date = x.Date.ToLongApplicationString(), text = BuildAuditString(x), user = x.User.ToString() }));
			if (comments != null)
				history.AddRange(comments.Select(x => new IssueHistoryViewModel { date = x.Date.ToLongApplicationString(), text = x.Text, user = x.User.ToString() }));
			return history.OrderByDescending(x => DateTime.Parse(x.date));
		}

	    private string BuildAuditString(IssueAudit audit)
	    {
		    return audit.Changes.Aggregate("", (current, change) => current + ("<br/>" + change.Property + ": <b>" + change.OldValue + "</b> to <b>" + change.NewValue + "</b>")).Substring(5);
	    }
    }

	public class IssueParams
	{
		public int start { get; set; }
		public int end { get; set; }
		public Project project { get; set; }
		public Priority priority { get; set; }
		public Status status { get; set; }
		public IssueType type { get; set; }
		public User developer { get; set; }
		public User tester { get; set; }
		public string filter { get; set; }
		public string milestones { get; set; }
		public string priorities { get; set; }
		public string statuses { get; set; }
		public string types { get; set; }
		public string developers { get; set; }
		public string testers { get; set; }

		public SortDirection direction { get; set; }
		public string comparer { get; set; }

		public Search BuildSearch()
		{
			return new Search {
				project = project,
				developer = developer,
				start = start,
				end = end,
				priority = priority,
				status = status,
				type = type,
				tester = tester,
				filter = filter,
				milestones = string.IsNullOrEmpty(milestones) ? new List<Milestone>() : milestones.Split(',').Select(x => new Milestone { Id = new Guid(x) }),
				priorities = string.IsNullOrEmpty(priorities) ? new List<Priority>() : priorities.Split(',').Select(x => new Priority { Id = new Guid(x) }),
				statuses = string.IsNullOrEmpty(statuses) ? new List<Status>() : statuses.Split(',').Select(x => new Status { Id = new Guid(x) }),
				types = string.IsNullOrEmpty(types) ? new List<IssueType>() : types.Split(',').Select(x => new IssueType { Id = new Guid(x) }),
				developers = string.IsNullOrEmpty(developers) ? new List<User>() : developers.Split(',').Select(x => new User { Id = new Guid(x) }),
				testers = string.IsNullOrEmpty(testers) ? new List<User>() : testers.Split(',').Select(x => new User { Id = new Guid(x) }),
			};
		}

		public Sort BuildSort()
		{
			return new Sort {
				direction = direction,
				comparer = comparer
			};
		}
	}
}
