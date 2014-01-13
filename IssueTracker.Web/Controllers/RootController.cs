using System.Collections.Generic;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Web.Controllers
{
    public class RootController : Controller
    {
		public IPriorityRepository PriorityRepository { get; set; }
		public IStatusRepository StatusRepository { get; set; }
		public IUserRepository UserRepository { get; set; }

		public ActionResult Index()
        {
            return View("~/Views/Shared/Root.cshtml", new RootModel {
	            Priorities = PriorityRepository.All(x => x.Order),
				Statuses = StatusRepository.All(x => x.Order),
				Users = UserRepository.All(x => x.Name)
            });
        }
    }

	public class RootModel
	{
		public IEnumerable<Priority> Priorities { get; set; }
		public IEnumerable<Status> Statuses { get; set; }
		public IEnumerable<ApplicationUser> Users { get; set; } 
	}
}
