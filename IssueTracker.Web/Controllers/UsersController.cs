using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Web.Controllers
{
	public class UsersController : BaseController
	{
		public ActionResult Index()
		{
			return PartialView(new UsersViewModel {
				Users = UserRepository.Project(CurrentProject, x => x.Name).Select(Mapper.DynamicMap<User, UserViewModel>)
			});
		}
	}
}