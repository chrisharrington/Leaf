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
		public IUserRepository UserRepository { get; set; }

	    public User SignedInUser
	    {
			get { return UserRepository.All().First(); }
	    }

	    public void Validate(object obj)
	    {
		    if (obj == null)
			    throw new HttpException(400, "The object failed validation.");

		    var context = new ValidationContext(obj);
		    var results = new List<ValidationResult>();
		    
			if (!Validator.TryValidateObject(obj, context, results))
				throw new HttpException(400, "The object failed validation: " + results.Select(x => x.ToString()).Aggregate((first, second) => first + "; " + second));
	    }
    }
}
