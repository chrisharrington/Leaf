using System;
using System.Dynamic;
using System.Linq;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Extensions;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Web.Controllers
{
    public class IssuesController : Controller
    {
		public IStatusRepository StatusRepository { get; set; }
		public IPriorityRepository PriorityRepository { get; set; }
		public IUserRepository UserRepository { get; set; }
		public IIssueRepository IssueRepository { get; set; }

		public ActionResult Index()
		{
			return View();
		}

	    public ActionResult Details(string issueName, Guid projectId)
	    {
		    var issue = IssueRepository.ProjectAndName(projectId, issueName);
		    return View(new {
			    number = issue.Number,
				name = issue.Name,
				priority = issue.Priority.ToString(),
				status = issue.Status.ToString()
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
