using System;
using System.Collections.Generic;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class ProjectRepository : BaseRepository<Project>, IProjectRepository
	{
		public IEnumerable<Project> User(Guid userId)
		{
			return Context.Projects.Where(x => x.User.Id == userId);
		}
	}
}