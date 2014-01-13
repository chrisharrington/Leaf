using System;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class PriorityRepository : BaseRepository<Priority>, IPriorityRepository
	{
		public Priority Name(string priority)
		{
			if (string.IsNullOrEmpty(priority))
				throw new ArgumentNullException("priority");

			return Context.Priorities.FirstOrDefault(x => x.Name.ToLower().Trim() == priority.ToLower().Trim());
		}
	}
}