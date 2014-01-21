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
				var attachedEntity = Context.Set<TModel>().Local.SingleOrDefault(e => e.Id == model.Id);
				SetComplexProperties(model, attachedEntity);
				if (attachedEntity != null)
					Context.Entry(attachedEntity).CurrentValues.SetValues(model);
				else
					entry.State = EntityState.Modified;
			}
			else
				entry.State = EntityState.Modified;
			Context.SaveChanges();
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

		private void SetComplexProperties(TModel source, TModel destination)
		{
			foreach (var property in typeof (TModel).GetProperties().Where(x => x.GetGetMethod().IsVirtual))
				property.SetValue(destination, property.GetValue(source));
		}
	}
}