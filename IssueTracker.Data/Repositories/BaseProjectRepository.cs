using System;
using System.Collections.Generic;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class BaseProjectRepository<TModel> : BaseRepository<TModel>, IBaseProjectRepository<TModel> where TModel : ProjectModel
	{
		public IEnumerable<TModel> Project(Project project, Func<TModel, object> sort = null)
		{
			if (project == null)
				throw new ArgumentNullException("project");

			var results = (IEnumerable<TModel>) Context.Set<TModel>().Where(x => x.Project.Id == project.Id);
			if (sort != null)
				results = results.OrderBy(sort);
			return results;
		}

		public TModel ProjectAndName(Guid projectId, string name)
		{
			if (projectId == Guid.Empty)
				throw new ArgumentNullException("projectId");
			if (string.IsNullOrEmpty(name))
				throw new ArgumentNullException("name");

			return Context.Set<TModel>().FirstOrDefault(x => x.Project.Id == projectId && x.Name.ToLower().Trim() == name.ToLower().Trim());
		}
	}
}