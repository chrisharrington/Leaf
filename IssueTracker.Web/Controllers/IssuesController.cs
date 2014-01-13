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

	    public ActionResult Next(Search search, Sort sort)
	    {
		    if (sort == null || sort.comparer == null)
			    sort = new Sort {direction = SortDirection.Descending, comparer = "priority"};

			return Json(IssueRepository.Search(search, sort).Select(x => new {
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
			}), JsonRequestBehavior.AllowGet);
	    }

	    private static string ToPriorityStyleString(Base priority)
	    {
		    return priority.Name.Replace(" ", "-").ToLower();
	    }
    }
}
