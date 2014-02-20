using System;
using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IProjectRepository : IRepository<Project>
	{
		IEnumerable<Project> User(Guid userId);
	}
}