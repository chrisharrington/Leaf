using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Extensions;
using IssueTracker.Common.Models;

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

	    public ActionResult Next(Search search)
	    {
			return Json(GetIssues(search.start, search.end, search.priority, search.status, search.assignee), JsonRequestBehavior.AllowGet);
	    }

	    private Status GetStatus(string status)
	    {
		    return string.IsNullOrEmpty(status) ? null : StatusRepository.Name(status);
	    }

	    private IEnumerable<object> GetIssues(int start, int end, Priority priority, Status status, ApplicationUser assignee)
	    {
		    return IssueRepository.Search(start, end, priority, status, assignee).Select(x => new {
				number = x.Number,
				name = x.Name,
				description = x.Description,
				priority = x.Priority.ToString(),
				owner = x.Owner.ToString(),
				assignee = x.Assignee.ToString(),
				status = x.Status.ToString(),
				priorityStyle = ToPriorityStyleString(x.Priority),
				opened = x.Opened.ToApplicationString(),
				closed = x.Closed.ToApplicationString()
			});
	    }

	    private static string ToPriorityStyleString(Base priority)
	    {
		    return priority.Name.Replace(" ", "-").ToLower();
	    }
    }

	public class Search
	{
		public int start { get; set; }
		public int end { get; set; }
		public Priority priority { get; set; }
		public Status status { get; set; }
		public ApplicationUser assignee { get; set; }
	}
}
