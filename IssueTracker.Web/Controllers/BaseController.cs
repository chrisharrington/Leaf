using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Web.Controllers
{
    public class BaseController : Controller
    {
	    private Project _project;

		public IUserRepository UserRepository { get; set; }
		public IProjectRepository ProjectRepository { get; set; }

	    public User SignedInUser
	    {
		    get { return !HttpContext.User.Identity.IsAuthenticated ? null : UserRepository.Email(HttpContext.User.Identity.Name); }
	    }

	    public Project CurrentProject
	    {
		    get { return _project ?? (_project = GetCurrentProject()); }
	    }

	    public void Validate(object obj)
	    {
		    if (obj == null)
			    throw new HttpException(400, "The object failed validation because it's null.");

		    var context = new ValidationContext(obj, null, null);
		    var results = new List<ValidationResult>();
			if (!Validator.TryValidateObject(obj, context, results))
				throw new HttpException(400, "The object failed validation: " + results.Select(x => x.ToString()).Aggregate((first, second) => first + " " + second));
	    }

	    private Project GetCurrentProject()
	    {
		    var parameters = ControllerContext.RequestContext.HttpContext.Request.Params;
		    if (parameters.AllKeys.All(x => x != "projectId"))
			    return null;

			var rawProjectId = parameters["projectId"];
		    Guid projectId;
		    if (!Guid.TryParse(rawProjectId, out projectId))
			    return null;

		    return ProjectRepository.Details(projectId);
	    }
    }
}
