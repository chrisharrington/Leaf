using System;
using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IRepository<TModel> where TModel : Base
	{
		Guid Insert(TModel model);
		void Update(TModel model);
		void Delete(TModel model);
		IEnumerable<TModel> All(Func<TModel, object> orderBy = null);
	}
}