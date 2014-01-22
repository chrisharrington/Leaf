using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using IssueTracker.Common.Models;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IRepository<TModel> where TModel : BaseModel
	{
		TModel Details(Guid id, params Expression<Func<TModel, object>>[] includes);
		Guid Insert(TModel model);
		void Update(TModel model);
		void Delete(TModel model);
		IEnumerable<TModel> All(Func<TModel, object> orderBy = null);
	}
}