using System;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class StatusRepository : BaseProjectRepository<Status>, IStatusRepository
	{
		public Status Name(string status)
		{
			if (string.IsNullOrEmpty(status))
				throw new ArgumentNullException("status");

			return Context.Statuses.FirstOrDefault(x => x.Name.ToLower().Trim() == status.ToLower().Trim());
		}
	}
}