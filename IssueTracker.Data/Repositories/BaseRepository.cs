using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Linq;
using Dapper;
using DapperExtensions;
using IssueTracker.Common.Data.Attributes;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class BaseRepository<TModel> : IRepository<TModel> where TModel : Base
	{
		private readonly ConnectionStringSettings _connectionString;

		public BaseRepository(string connectionStringName = "DefaultDataConnection")
		{
			_connectionString = ConfigurationManager.ConnectionStrings[connectionStringName];
		}

		public IDbConnection OpenConnection()
		{
			var connection = DbProviderFactories.GetFactory(_connectionString.ProviderName).CreateConnection();
			connection.ConnectionString = _connectionString.ConnectionString;
			connection.Open();
			return connection;
		}

		public Guid Insert(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				model.Id = Guid.NewGuid();
			if (string.IsNullOrEmpty(model.Name))
				throw new ArgumentException("model.Name");

			using (var connection = OpenConnection())
			{
				return connection.Insert(model, GetTableName());
			}
		}

		public void Update(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");

			using (var connection = OpenConnection())
			{
				connection.Update(model);
			}
		}

		public void Delete(TModel model)
		{
			if (model == null)
				throw new ArgumentNullException("model");
			if (model.Id == Guid.Empty)
				throw new ArgumentNullException("model.Id");

			using (var connection = OpenConnection())
			{
				connection.Delete(model, tableName: GetTableName());
			}
		}

		public IEnumerable<TModel> All(Func<TModel, object> orderBy = null)
		{
			using (var connection = OpenConnection())
			{
				var results = connection.Query<TModel>("select * from " + GetTableName());
				if (orderBy != null)
					results = results.OrderBy(orderBy);
				return results;
			}
		}

		private string GetTableName()
		{
			var type = typeof (TModel);
			var tableNameAttribute = Attribute.GetCustomAttribute(type, typeof(TableNameAttribute)) as TableNameAttribute;
			return tableNameAttribute == null ? type.Name : tableNameAttribute.Name;
		}
	}
}