using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using IssueTracker.Common.Models;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IRepository<TModel> where TModel : IdModel
	{
		TModel Details(Guid id, params Expression<Func<TModel, object>>[] includes);
		Guid Insert(TModel model, User user);
		void Update(TModel model, User user);
		void Delete(TModel model, User user);
		IEnumerable<TModel> All(Func<TModel, object> orderBy = null, params Expression<Func<TModel, object>>[] includes);
	}
}