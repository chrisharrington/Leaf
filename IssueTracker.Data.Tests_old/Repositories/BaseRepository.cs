using System;
using System.Linq;
using Dapper;
using IssueTracker.Common.Models;
using IssueTracker.Data.Repositories;
using Xunit;

namespace IssueTracker.Data.Tests.Repositories
{
	public class BaseRepository : IntegrationTest
	{
		private readonly BaseRepository<Project> _sut;

		public BaseRepository()
		{
			_sut = new BaseRepository<Project> { Context = BuildContext() };
		}

		[Fact]
		public void ShouldInsert()
		{
			var project = new Project {Id = Guid.NewGuid(), Name = "the name"};

			_sut.Insert(project);

			using (var connection = OpenConnection())
			{
				var collection = connection.Query<Project>("select * from Projects").ToArray();
				Assert.True(collection.Length == 1);

				var retrieved = collection.First();
				Assert.NotNull(retrieved);
				Assert.True(retrieved.Id == project.Id);
				AssertPropertiesAreEqual(retrieved, project, x => x.Id, x => x.Name);
			}
		}
	}
}
