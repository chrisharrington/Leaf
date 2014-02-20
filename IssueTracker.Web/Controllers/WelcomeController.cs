using System.Web.Mvc;
using AutoMapper;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;
using WebMatrix.WebData;

namespace IssueTracker.Web.Controllers
{
	public class WelcomeController : BaseController
	{
		public ActionResult Index()
		{
			return View();
		}

		[HttpPost]
		public ActionResult SignIn(SignInViewModel model)
		{
			var signedIn = WebSecurity.Login(model.email, model.password, model.staySignedIn);
			if (!signedIn)
				return null;

			var user = UserRepository.Email(model.email);

			return Json(new SignedInViewModel {
				User = Mapper.DynamicMap<User, UserViewModel>(user),
				//Project = Mapper.DynamicMap<Project, ProjectViewModel>(ProjectRepository.)
			});
		}
	}
}