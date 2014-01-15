using System.Collections.Generic;
using System.Linq;
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
		public IProjectRepository ProjectRepository { get; set; }

		public ActionResult Index()
		{
			var projects = ProjectRepository.All(x => x.Name).ToArray();
			var selectedProject = projects.First();
			return View("~/Views/Shared/Root.cshtml", new RootModel {
	            Priorities = PriorityRepository.Project(selectedProject, x => x.Order),
				Statuses = StatusRepository.Project(selectedProject, x => x.Order),
				Users = UserRepository.All(x => x.Name),
				Projects = projects,
				SelectedProject = new { name = selectedProject.Name, id = selectedProject.Id }
            });
		}

	    public ActionResult Filters(Project project)
	    {
		    return Json(new {
			    priorities = PriorityRepository.Project(project, x => x.Order),
			    statuses = StatusRepository.Project(project, x => x.Order),
			    users = UserRepository.All(x => x.Name),
		    }, JsonRequestBehavior.AllowGet);
	    }
    }

	public class RootModel
	{
		public IEnumerable<Priority> Priorities { get; set; }
		public IEnumerable<Status> Statuses { get; set; }
		public IEnumerable<User> Users { get; set; }
		public IEnumerable<Project> Projects { get; set; }
		public object SelectedProject { get; set; }
	}
}
