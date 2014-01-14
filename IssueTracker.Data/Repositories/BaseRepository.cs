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
		public IDataContext Context { get; set; }

		public Guid Insert(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				model.Id = Guid.NewGuid();
			if (string.IsNullOrEmpty(model.Name))
				throw new ArgumentException("model.Name");

			GetCollectionFromContext().Add(model);
			Context.SaveChanges();
			return model.Id;
		}

		public void Update(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");

			var collection = GetCollectionFromContext();
			collection.Attach(model);
			Context.Entry(model).State = EntityState.Modified;
			Context.SaveChanges();
		}

		public void Delete(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				throw new ArgumentNullException("model.Id");

			GetCollectionFromContext().Remove(model);
			Context.SaveChanges();
		}

		public IEnumerable<TModel> All(Func<TModel, object> orderBy = null)
		{
			var collection = GetCollectionFromContext();
			if (orderBy != null)
				return collection.OrderBy(orderBy);
			return collection;
		}

		private DbSet<TModel> GetCollectionFromContext()
		{
			var property = Context.GetType().GetProperties().FirstOrDefault(x => x.PropertyType.GenericTypeArguments.Any(y => y == typeof(TModel)));//
			if (property == null)
				throw new InvalidOperationException("No collection for model \"" + typeof (TModel).Name + "\" was found on the data context.");
			return (DbSet<TModel>) property.GetValue(Context);
		}
	}
}