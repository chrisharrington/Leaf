using System.Linq;
using System.Net;
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
				return new HttpStatusCodeResult(HttpStatusCode.Unauthorized, "Your credentials are invalid.");

			var user = UserRepository.Email(model.email);
			return Json(new SignedInViewModel {
				user = Mapper.DynamicMap<User, UserViewModel>(user),
				project = Mapper.DynamicMap<Project, ProjectViewModel>(ProjectRepository.User(user.Id).First())
			});
		}
	}
}