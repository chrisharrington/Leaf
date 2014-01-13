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

	    public ActionResult Next(int start, int end, string priority, string status)
	    {
		    return Json(GetIssues(start, end, GetPriority(priority), GetStatus(status)), JsonRequestBehavior.AllowGet);
	    }

	    private Status GetStatus(string status)
	    {
		    return string.IsNullOrEmpty(status) ? null : StatusRepository.Name(status);
	    }

	    private Priority GetPriority(string priority)
	    {
		    return string.IsNullOrEmpty(priority) ? null : PriorityRepository.Name(priority);
	    }

	    private IEnumerable<object> GetIssues(int start, int end, Priority priority, Status status)
	    {
		    return IssueRepository.Search(start, end, priority, status).Select(x => new {
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
}
