using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Web.Controllers
{
    public class RootController : Controller
    {
		public IPriorityRepository PriorityRepository { get; set; }
		public IStatusRepository StatusRepository { get; set; }
		public IUserRepository UserRepository { get; set; }
		public IProjectRepository ProjectRepository { get; set; }
		public ITransitionRepository TransitionRepository { get; set; }

		public ActionResult Index()
		{
			var projects = ProjectRepository.All(x => x.Name).ToArray();
			var selectedProject = projects.First();
			var signedInUser = UserRepository.All().First();
			return View("~/Views/Shared/Root.cshtml", new RootModel {
	            Priorities = PriorityRepository.Project(selectedProject, x => x.Order).ToArray().Select(x => new OrderViewModel {id = x.Id, name = x.Name, order = x.Order}),
				Statuses = StatusRepository.Project(selectedProject, x => x.Order).ToArray().Select(x => new OrderViewModel {id = x.Id, name = x.Name, order = x.Order}),
				Users = UserRepository.All(x => x.Name).ToArray(),
				Projects = projects.ToArray().Select(project => new ProjectViewModel {id = project.Id, name = project.Name}),
				Transitions = TransitionRepository.All(x => x.Name).Select(x => new TransitionViewModel {id = x.Id, fromId = x.From.Id, toId = x.To.Id, name = x.Name}),
				SelectedProject = new { name = selectedProject.Name, id = selectedProject.Id },
				SignedInUser = new { name = signedInUser.Name, emailAddress = signedInUser.EmailAddress, id = signedInUser.Id }
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
		public IEnumerable<OrderViewModel> Priorities { get; set; }
		public IEnumerable<OrderViewModel> Statuses { get; set; }
		public IEnumerable<User> Users { get; set; }
		public IEnumerable<ProjectViewModel> Projects { get; set; }
		public IEnumerable<TransitionViewModel> Transitions { get; set; }
		public object SelectedProject { get; set; }
		public object SignedInUser { get; set; }
	}
}
