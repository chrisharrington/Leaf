using System;
using System.Linq;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class PriorityRepository : BaseRepository<Priority>, IPriorityRepository
	{
		public Priority Name(string priority)
		{
			if (string.IsNullOrEmpty(priority))
				throw new ArgumentNullException("priority");

			using (var connection = OpenConnection())
			{
				return connection.Query<Priority>("select * from Priorities where Name like '%' + @name + '%'", new {name = priority.ToLower().Trim()}).FirstOrDefault();
			}
		}
	}
}