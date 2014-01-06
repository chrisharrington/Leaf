using System.Web.Mvc;

namespace IssueTracker.Web.Controllers
{
    public class RootController : Controller
    {
		public ActionResult Index()
        {
            return View("~/Views/Shared/Root.cshtml");
        }

    }
}
