using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IssueTracker.Common.Models;

namespace IssueTracker.Web.Controllers
{
    public class IssuesController : Controller
    {
	    private Random _random;

		public ActionResult Index()
		{
			_random = new Random();
			return View(BuildIssues().Select(x => new {
				number = x.Number,
				name = x.Name,
				description = x.Description,
				priority = x.Priority.ToString(),
				owner = x.Owner.ToString(),
				status = x.Status.ToString(),
				priorityStyle = ToPriorityStyleString(x.Priority)
			}));
		}

	    private string ToPriorityStyleString(Priority priority)
	    {
		    return priority.Name.Replace(" ", "-").ToLower();
	    }

	    private IEnumerable<Issue> BuildIssues()
	    {
		    var statuses = BuildStatuses();
		    var priorities = BuildPriorities();
			const string loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
		    var owner = new User {EmailAddress = "chrisharrington99@gmail.com", Name = "Chris Harrington"};

		    const int numIssues = 15;
		    var list = new List<Issue>();
		    for (var i = 1; i <= numIssues; i++)
			    list.Add(new Issue {
					Number = i,
				    Name = "name " + i,
				    Description = RandomWords(loremIpsum),
				    Owner = owner,
				    Priority = priorities.ElementAt(_random.Next(0, priorities.Count())),
				    Status = statuses.ElementAt(_random.Next(0, priorities.Count()))
			    });
		    return list;
	    }

	    private string RandomWords(string text)
	    {
		    var words = text.Split(' ');
		    var result = "";
		    for (var i = 0; i < words.Length; i++)
			    result += " " + words[_random.Next(0, words.Length - 1)];
		    result = result.Substring(1).ToLower();
		    return result[1].ToString().ToUpper() + result.Substring(2);
	    }

	    private IEnumerable<Status> BuildStatuses()
	    {
		    var order = 1;
		    var list = new List<Status>();
			list.Add(new Status {Name = "Pending", Order = order++});
			list.Add(new Status {Name = "In Development", Order = order++});
			list.Add(new Status {Name = "Ready to Test", Order = order++});
			list.Add(new Status {Name = "In Testing", Order = order++});
			list.Add(new Status {Name = "Failed Testing", Order = order++});
			list.Add(new Status {Name = "Complete", Order = order});
		    return list;
	    }

	    private IEnumerable<Priority> BuildPriorities()
	    {
		    var order = 1;
		    var list = new List<Priority>();
			list.Add(new Priority {Name = "Low", Order = order++});
			list.Add(new Priority {Name = "Medium", Order = order++});
			list.Add(new Priority {Name = "High", Order = order++});
			list.Add(new Priority {Name = "Critical", Order = order});
		    return list;
	    }
    }
}
