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

			var results = (IEnumerable<TModel>) GetCollectionFromContext().Where(x => x.Project.Id == project.Id);
			if (sort != null)
				results = results.OrderBy(sort);
			return results;
		}
	}
}