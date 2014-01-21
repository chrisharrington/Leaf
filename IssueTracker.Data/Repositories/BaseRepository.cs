using System;
using System.Collections.Generic;
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

			var retrieved = Context.Set<TModel>().Find(model.Id);
			if (retrieved == null)
				throw new InvalidOperationException("Missing model to update.");

			Context.Entry(retrieved).CurrentValues.SetValues(model);
			SetComplexProperties(model, retrieved);
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