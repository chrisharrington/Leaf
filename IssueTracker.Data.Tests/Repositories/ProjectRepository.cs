using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using Xunit;

namespace IssueTracker.Data.Tests.Repositories
{
	public class ProjectRepository : IntegrationTest
	{
		private readonly IProjectRepository _sut;

		public ProjectRepository()
		{
			_sut = new Data.Repositories.ProjectRepository {Context = BuildContext()};
		}

		[Fact]
		public void ShouldGetAllProjects()
		{
			var users = CreateUsers().ToArray();
			var first = CreateProject(users);
			first.Name = "the first name";
			var second = CreateProject(users);
			second.Name = "the second name";

			_sut.Insert(first);
			_sut.Insert(second);

			var collection = _sut.All(x => x.Name).ToArray();
			Assert.True(collection.Length == 2);

			AssertPropertiesAreEqual(collection[0], first, x => x.Id, x => x.Name);
			AssertPropertiesAreEqual(collection[1], second, x => x.Id, x => x.Name);
			AssertPropertiesAreEqual(collection[0].Users.First(), users.First(), x => x.Id);
			AssertPropertiesAreEqual(collection[0].Users.Last(), users.Last(), x => x.Id);
			AssertPropertiesAreEqual(collection[1].Users.First(), users.First(), x => x.Id);
			AssertPropertiesAreEqual(collection[1].Users.Last(), users.Last(), x => x.Id);
		}

		[Fact]
		public void ShouldInsertProject()
		{
			var users = CreateUsers().ToArray();
			var project = CreateProject(users);

			_sut.Insert(project);

			using (var connection = OpenConnection())
			{
				var collection = connection.Query<Project>("select * from Projects").ToArray();
				Assert.True(collection.Length == 1);

				var retrieved = collection.First();
				AssertPropertiesAreEqual(project, retrieved, x => x.Id, x => x.Name);
				AssertPropertiesAreEqual(project.Users.First(), users.First(), x => x.Id, x => x.EmailAddress, x => x.Name);
				AssertPropertiesAreEqual(project.Users.Last(), users.Last(), x => x.Id, x => x.EmailAddress, x => x.Name);
			}
		}

		[Fact]
		public void ShouldRemoveUser()
		{
			var users = CreateUsers().ToArray();
			var project = CreateProject(users);

			_sut.Insert(project);

			project.Users = new List<User> {users.First()};
			_sut.Update(project);

			var retrieved = _sut.All().First();
			Assert.True(retrieved.Users.Count() == 1);
			Assert.True(retrieved.Users.First().Id == users.First().Id);
		}

		[Fact]
		public void ShouldAddUser()
		{
			var users = CreateUsers().ToArray();
			var project = CreateProject(users);

			project.Users = new List<User> { users.First() };
			_sut.Insert(project);

			project.Users = new List<User> { users.First(), users.Last() };
			_sut.Update(project);

			var retrieved = _sut.All().First();
			Assert.True(retrieved.Users.Count() == 2);
			Assert.True(retrieved.Users.First().Id == users.First().Id);
			Assert.True(retrieved.Users.Last().Id == users.Last().Id);
		}

		[Fact]
		public void ShouldUpdateProject()
		{
			const string newName = "the new name";
			var project = CreateProject();

			_sut.Insert(project);

			project.Name = newName;
			_sut.Update(project);

			using (var connection = OpenConnection())
			{
				var collection = connection.Query<Project>("select * from Projects").ToArray();
				Assert.True(collection.Length == 1);

				var retrieved = collection.First();
				Assert.True(project.Id == retrieved.Id);
				Assert.True(retrieved.Name == newName);
			}
		}

		private static IEnumerable<User> CreateUsers()
		{
			var user1 = new User { Id = Guid.NewGuid(), EmailAddress = "the first email address", Name = "the first name" };
			var user2 = new User { Id = Guid.NewGuid(), EmailAddress = "the second email address", Name = "the second name" };
			return new List<User> {user1, user2};
		} 

		private static Project CreateProject(IEnumerable<User> users = null)
		{
			if (users == null)
				users = new List<User>();
			return new Project { Id = Guid.NewGuid(), Name = "the project name", Users = users};
		}
	}
}