using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
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
		public ITransitionRepository TransitionRepository { get; set; }

		public ActionResult Index()
		{
			return View();
		}

	    public ActionResult Details(string issueName, Guid projectId)
	    {
		    var issue = IssueRepository.ProjectAndName(projectId, issueName);
		    return View(new IssueViewModel {
				id = issue.Id,
			    number = issue.Number,
				name = issue.Name,
				priority = issue.Priority.ToString(),
				priorityId = issue.Priority.Id,
				status = issue.Status.ToString(),
				statusId = issue.Status.Id,
				developer = issue.Developer.ToString(),
				developerId = issue.Developer.Id,
				tester = issue.Tester.ToString(),
				testerId = issue.Tester.Id,
				description = issue.Description,
				opened = issue.Opened.ToApplicationString(),
				closed = issue.Closed.ToApplicationString(),
				updatedId = issue.UpdatedBy.Id,
				updated = issue.Updated.ToApplicationString(),
				transitions = TransitionRepository.Status(issue.Status).Select(x => new {id = x.Id, name = x.Name, fromId = x.From.Id, toId = x.To.Id})
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
				description = x.Description,
				priority = x.Priority.ToString(),
				tester = x.Tester.ToString(),
				developer = x.Developer.ToString(),
				status = x.Status.ToString(),
				priorityStyle = ToPriorityStyleString(x.Priority),
				opened = x.Opened.ToApplicationString(),
				closed = x.Closed.ToApplicationString(),
				lastUpdated = x.Updated.ToLongApplicationString(),
				updatedBy = x.UpdatedBy.ToString()
			}), JsonRequestBehavior.AllowGet);
	    }

	    [HttpPost]
	    public void UpdateDescription(Guid issueId, string description)
	    {
		    var model = IssueRepository.Details(issueId);
		    if (model == null)
			    throw new ArgumentException("The issue ID \"" + issueId + "\" corresponds to no issue.");

		    model.Description = description;
		    IssueRepository.Update(model);
	    }

	    [HttpPost]
	    public void UpdateName(Guid issueId, string name)
	    {
			var model = IssueRepository.Details(issueId);
			if (model == null)
				throw new ArgumentException("The issue ID \"" + issueId + "\" corresponds to no issue.");

			model.Name = name;
			IssueRepository.Update(model);
	    }

		[HttpPost]
	    public void Update(IssueViewModel issue)
	    {
		    if (issue == null || issue.id == Guid.Empty)
			    throw new ArgumentNullException("issue");

			issue.updated = DateTime.Now.ToApplicationString();
			issue.updatedId = SignedInUser.Id;
			IssueRepository.Update(Mapper.Map<IssueViewModel, Issue>(issue));
	    }

	    [HttpPost]
	    public void ExecuteTransition(Guid issueId, Guid statusId)
	    {
		    var issue = IssueRepository.Details(issueId);
		    var status = StatusRepository.Details(statusId);
		    issue.Status = status;
		    IssueRepository.Update(issue);
	    }

	    private static string ToPriorityStyleString(BaseModel priority)
	    {
		    return priority.Name.Replace(" ", "-").ToLower();
	    }
    }

	public class IssueParams
	{
		public int start { get; set; }
		public int end { get; set; }
		public Project project { get; set; }
		public Priority priority { get; set; }
		public Status status { get; set; }
		public User developer { get; set; }
		public User tester { get; set; }
		public string filter { get; set; }
		public string priorities { get; set; }
		public string statuses { get; set; }
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
				tester = tester,
				filter = filter,
				priorities = string.IsNullOrEmpty(priorities) ? new List<Priority>() : priorities.Split(',').Select(x => new Priority { Id = new Guid(x) }),
				statuses = string.IsNullOrEmpty(statuses) ? new List<Status>() : statuses.Split(',').Select(x => new Status {  Id = new Guid(x) }),
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
