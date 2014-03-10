using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;

namespace IssueTracker.Web.Controllers
{
	public class UsersController : BaseController
	{
		public IIssueRepository IssueRepository { get; set; }

		public ActionResult Index()
		{
			var issues = IssueRepository.Project(CurrentProject).Where(x => x.Closed == null).ToArray();
			var users = UserRepository.Project(CurrentProject, x => x.Name).Select(Mapper.DynamicMap<User, UserViewModel>).ToArray();
			foreach (var user in users)
			{
				user.developerIssueCount = issues.Count(x => x.Developer.Id == user.id);
				user.testerIssueCount = issues.Count(x => x.Tester.Id == user.id);
			}
			return PartialView(new UsersViewModel { Users = users });
		}

		[HttpPost]
		public void Delete(UserViewModel user)
		{
			var count = UserRepository.Count(x => x.Project.Id == CurrentProject.Id);
			if (count == 1)
				throw new HttpException(403, "You can't delete the only user.");

			UserRepository.Delete(Mapper.DynamicMap<UserViewModel, User>(user), SignedInUser);
		}
	}
}