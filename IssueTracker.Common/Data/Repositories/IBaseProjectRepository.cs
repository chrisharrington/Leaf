using System;
using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IBaseProjectRepository<TModel> : IRepository<TModel> where TModel : ProjectModel
	{
		IEnumerable<TModel> Project(Project project, Func<TModel, object> sort = null);
	}
}