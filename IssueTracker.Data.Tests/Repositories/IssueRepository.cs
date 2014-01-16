using System;
using System.Linq;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using Xunit;

namespace IssueTracker.Data.Tests.Repositories
{
	public class IssueRepository : IntegrationTest
	{
		private readonly IIssueRepository _sut;

		public IssueRepository()
		{
			_sut = new Data.Repositories.IssueRepository {Context = BuildContext()};
		}

		[Fact]
		public void ShouldGetAllIssues()
		{
			var first = CreateIssues();
			first.Name = "the first name";
			var second = CreateIssues();
			second.Name = "the second name";

			_sut.Insert(first);
			_sut.Insert(second);

			var collection = _sut.All(x => x.Name).ToArray();
			Assert.True(collection.Length == 2);

			AssertPropertiesAreEqual(collection[0], first, x => x.Id, x => x.Name);
			AssertPropertiesAreEqual(collection[1], second, x => x.Id, x => x.Name);
		}

		[Fact]
		public void ShouldInsertIssue()
		{
			var issue = CreateIssues();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				var collection = connection.Query<Issue>("select * from Issues").ToArray();
				Assert.True(collection.Length == 1);

				var retrieved = collection.First();
				AssertPropertiesAreEqual(issue, retrieved, x => x.Id, x => x.Name);
			}
		}

		[Fact]
		public void ShouldUpdateIssue()
		{
			const string newName = "the new name";
			var issue = CreateIssues();

			_sut.Insert(issue);

			issue.Name = newName;
			_sut.Update(issue);

			using (var connection = OpenConnection())
			{
				var collection = connection.Query<Issue>("select * from Issues").ToArray();
				Assert.True(collection.Length == 1);

				var retrieved = collection.First();
				Assert.True(issue.Id == retrieved.Id);
				Assert.True(retrieved.Name == newName);
			}
		}

		private static Issue CreateIssues()
		{
			return new Issue { Id = Guid.NewGuid(), Name = "the issue name", Assignee = CreateUser("the assignee"), Owner = CreateUser("the owner"), Description = "the description", Number = 10, Opened = DateTime.Now, Priority = CreatePriority(), Project = CreateProject(), Status = CreateStatus(), Updated = DateTime.Now, UpdatedBy = CreateUser("the updating user") };
		}

		private static Project CreateProject()
		{
			return new Project {Id = Guid.NewGuid(), Name = "the name"};
		}

		private static Priority CreatePriority()
		{
			return new Priority {Id = Guid.NewGuid(), Name = "the priority", Order = 10};
		}

		private static Status CreateStatus()
		{
			throw new NotImplementedException();
		}

		private static User CreateUser(string name)
		{
			return new User {Id = Guid.NewGuid(), EmailAddress = "the email address", Name = name};
		}
	}
}