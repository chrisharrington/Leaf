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
			var first = CreateIssue();
			first.Name = "the first name";
			var second = CreateIssue();
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
			var issue = CreateIssue();

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
			var issue = CreateIssue();

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

		[Fact]
		public void ShouldInsertAttachedProject()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select Project_Id from Issues").First(), issue.Project.Id);

				var retrieved = connection.Query<Project>("select * from Projects where Id = @id", new {id = issue.Project.Id}).First();
				AssertPropertiesAreEqual(retrieved, issue.Project, x => x.Id, x => x.Name);
			}
		}

		[Fact]
		public void ShouldInsertAttachedPriority()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select Priority_Id from Issues").First(), issue.Priority.Id);

				var retrieved = connection.Query<Priority>("select * from Priorities where Id = @id", new { id = issue.Priority.Id }).First();
				AssertPropertiesAreEqual(retrieved, issue.Priority, x => x.Id, x => x.Name, x => x.Order);
			}
		}

		[Fact]
		public void ShouldInsertAttachedStatus()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select Status_Id from Issues").First(), issue.Status.Id);

				var retrieved = connection.Query<Status>("select * from Status where Id = @id", new { id = issue.Status.Id }).First();
				AssertPropertiesAreEqual(retrieved, issue.Status, x => x.Id, x => x.Name, x => x.Order);
			}
		}

		[Fact]
		public void ShouldInsertAttachedAssignee()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select Assignee_Id from Issues").First(), issue.Assignee.Id);

				var retrieved = connection.Query<User>("select * from Users where Id = @id", new { id = issue.Assignee.Id }).First();
				AssertPropertiesAreEqual(retrieved, issue.Assignee, x => x.Id, x => x.Name, x => x.EmailAddress);
			}
		}

		[Fact]
		public void ShouldInsertAttachedOwner()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select Owner_Id from Issues").First(), issue.Owner.Id);

				var retrieved = connection.Query<User>("select * from Users where Id = @id", new { id = issue.Owner.Id }).First();
				AssertPropertiesAreEqual(retrieved, issue.Owner, x => x.Id, x => x.Name, x => x.EmailAddress);
			}
		}

		[Fact]
		public void ShouldInsertAttachedUpdater()
		{
			var issue = CreateIssue();

			_sut.Insert(issue);

			using (var connection = OpenConnection())
			{
				Assert.Equal(connection.Query<Guid>("select UpdatedBy_Id from Issues").First(), issue.UpdatedBy.Id);

				var retrieved = connection.Query<User>("select * from Users where Id = @id", new { id = issue.UpdatedBy.Id }).First();
				AssertPropertiesAreEqual(retrieved, issue.UpdatedBy, x => x.Id, x => x.Name, x => x.EmailAddress);
			}
		}

		private static Issue CreateIssue()
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
			return new Status {Id = Guid.NewGuid(), Name = "the status", Order = 5};
		}

		private static User CreateUser(string name)
		{
			return new User {Id = Guid.NewGuid(), EmailAddress = "the email address", Name = name};
		}
	}
}