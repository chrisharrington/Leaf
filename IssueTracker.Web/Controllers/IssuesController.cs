using System;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Extensions;
using IssueTracker.Common.Models;
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
				assignee = issue.Assignee.ToString(),
				assigneeId = issue.Assignee.Id,
				owner = issue.Owner.ToString(),
				ownerId = issue.Owner.Id,
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
				owner = x.Owner.ToString(),
				assignee = x.Assignee.ToString(),
				status = x.Status.ToString(),
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
		public User assignee { get; set; }
		public User owner { get; set; }
		public string filter { get; set; }

		public SortDirection direction { get; set; }
		public string comparer { get; set; }

		public Search BuildSearch()
		{
			return new Search {
				project = project,
				assignee = assignee,
				start = start,
				end = end,
				priority = priority,
				status = status,
				owner = owner,
				filter = filter
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
