using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class BaseRepository<TModel> : IRepository<TModel> where TModel : BaseModel
	{
		public DataContext Context { get; set; }

		public TModel Details(Guid id)
		{
			if (id == Guid.Empty)
				throw new ArgumentNullException("id");

			return Context.Set<TModel>().FirstOrDefault(x => x.Id == id);
		}

		public Guid Insert(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				model.Id = Guid.NewGuid();
			if (string.IsNullOrEmpty(model.Name))
				throw new ArgumentException("model.Name");

			Context.Set<TModel>().Add(model);
			Context.SaveChanges();
			return model.Id;
		}

		public void Update(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");

			var entry = Context.Entry(model);

			if (entry.State == EntityState.Detached)
			{
				var set = Context.Set<TModel>();
				var attachedEntity = set.Local.SingleOrDefault(e => e.Id == model.Id);  // You need to have access to key

				if (attachedEntity != null)
				{
					var attachedEntry = Context.Entry(attachedEntity);
					attachedEntry.CurrentValues.SetValues(model);
				}
				else
				{
					entry.State = EntityState.Modified;
				}
			}

//			var collection = Context.Set<TModel>();
//			var entry = Context.Entry(model);
//			if (entry.State == EntityState.Detached)
//				collection.Attach(model);
//			Context.Entry(model).State = EntityState.Modified;
//			Context.SaveChanges();
		}

		public void Delete(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				throw new ArgumentNullException("model.Id");

			Context.Set<TModel>().Remove(model);
			Context.SaveChanges();
		}

		public IEnumerable<TModel> All(Func<TModel, object> orderBy = null)
		{
			var collection = Context.Set<TModel>();
			if (orderBy != null)
				return collection.OrderBy(orderBy);
			return collection;
		}
	}
}