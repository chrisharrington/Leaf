using System.Data;
using System.Data.SqlClient;
using System.Data.SQLite;
using IssueTracker.Common.Tests;

namespace IssueTracker.Data.Tests.Repositories
{
	public class IntegrationTest : Test
	{
		protected string ConnectionString
		{
			get { return "Data Source=:memory:;Version=3;New=True;"; }
		}

		protected DataContext BuildContext()
		{
			var connection = new SQLiteConnection(ConnectionString);
			var context = new DataContext(connection);
			context.Database.Initialize(true);
			return context;
		}

		protected IDbConnection OpenConnection()
		{
			return new SqlConnection(ConnectionString);
		}
	}
}
