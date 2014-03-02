using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Data.Repositories
{
	public class BaseRepository<TModel> : IRepository<TModel> where TModel : IdModel
	{
		public DataContext Context { get; set; }

		public TModel Details(Guid id, params Expression<Func<TModel, object>>[] includes)
		{
			if (id == Guid.Empty)
				throw new ArgumentNullException("id");

			var set = (IQueryable<TModel>) Context.Set<TModel>();
			foreach (var include in includes)
				set = set.Include(include);
			return set.FirstOrDefault(x => x.Id == id);
		}

		public virtual Guid Insert(TModel model, User user)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				model.Id = Guid.NewGuid();

			Context.Set<TModel>().Add(model);
			Context.SaveChanges();
			return model.Id;
		}

		public virtual void Update(TModel model, User user)
		{
			if (model == null)
				throw new ArgumentNullException("model");

			var retrieved = Context.Set<TModel>().FirstOrDefault(x => x.Id == model.Id);
			if (retrieved == null)
				throw new ArgumentNullException("The ID \"" + model.Id + "\" corresponds to no saved model.");

			SetProperties(model, retrieved);
			Context.SaveChanges();

//			var entry = Context.Entry(model);
//
//			if (entry.State == EntityState.Detached)
//			{
//				var attachedEntity = Context.Set<TModel>().SingleOrDefault(e => e.Id == model.Id);
//				if (attachedEntity != null)
//					SetProperties(model, attachedEntity);
//				else
//					entry.State = EntityState.Modified;
//			}
//			else
//				entry.State = EntityState.Modified;
//			Context.SaveChanges();
		}

		public virtual void Delete(TModel model, User user)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				throw new ArgumentNullException("model.Id");

			model.IsDeleted = true;
			Update(model, user);
		}

		public IEnumerable<TModel> All(Func<TModel, object> orderBy = null)
		{
			var collection = Context.Set<TModel>().Where(x => !x.IsDeleted);
			if (orderBy != null)
				return collection.OrderBy(orderBy);
			return collection;
		}

		protected void SetProperties(TModel source, TModel destination)
		{
			foreach (var property in typeof (TModel).GetProperties())
				property.SetValue(destination, property.GetValue(source));
		}
	}
}