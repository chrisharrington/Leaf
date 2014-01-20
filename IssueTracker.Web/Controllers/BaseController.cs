using System.Linq;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Web.Controllers
{
    public class BaseController : Controller
    {
		public IUserRepository UserRepository { get; set; }

	    public User SignedInUser
	    {
			get { return UserRepository.All().First(); }
	    }
    }
}
