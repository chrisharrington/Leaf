using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using Autofac;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.Data;
using IssueTracker.SampleDataImporter.Authorization;
using WebMatrix.WebData;

namespace IssueTracker.SampleDataImporter
{
	public class Program
	{
		private const int NUM_ISSUES = 150;
		private const int NUM_PROJECTS = 5;
		private const string WORDS = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

		private static Random _random;
		private static IContainer _container;

		public static void Main(string[] args)
		{
			if (!ConfigurationManager.ConnectionStrings["DefaultDataConnection"].ConnectionString.Contains("Database=Development"))
				throw new Exception("Production database!");

			_random = new Random();
			_container = Dependencies.Dependencies.Register().Build();

			RemoveData();
			InitializeDatabase();

			var user = InsertAuthorizedUser();
			foreach (var project in BuildProjects(user))
				BuildIssues(user, project);
		}

		private static void InitializeDatabase()
		{
			using (var context = new DataContext())
			{
				context.Database.Initialize(true);
			}
		}

		private static IEnumerable<Project> BuildProjects(User user)
		{
			var names = new List<string>();
			var projects = new List<Project>();
			var projectRepository = _container.Resolve<IProjectRepository>();
			for (var i = 0; i < NUM_PROJECTS; i++)
			{
				string name;
				var words = WORDS.Split(' ');
				while (names.Contains(name = words[_random.Next(0, words.Length - 1)])) { }
				names.Add(name);

				var project = new Project { Id = Guid.NewGuid(), Name = name[0].ToString().ToUpper() + name.Substring(1), Users = new List<User> { user } };
				projects.Add(project);
				projectRepository.Insert(project);
			}
			return projects;
		}

		private static User InsertAuthorizedUser()
		{
			Database.SetInitializer<UserContext>(null);
			using (var context = new UserContext())
			{
				if (!context.Database.Exists())
					((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
			}
			WebSecurity.InitializeDatabaseConnection("DefaultDataConnection", "UserProfile", "UserId", "UserName", true);

			var user = new User { EmailAddress = "chrisharrington99@gmail.com", Id = Guid.NewGuid(), Name = "Chris Harrington" };
			WebSecurity.CreateUserAndAccount(user.EmailAddress, "password");
			_container.Resolve<IUserRepository>().Insert(user);
			return user;
		}

		private static void RemoveData()
		{
			using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultDataConnection"].ConnectionString))
			{
				connection.Open();
				connection.Execute(@"while(exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_TYPE='FOREIGN KEY'))
                                begin
                                    declare @sql nvarchar(2000)
                                    SELECT TOP 1 @sql=('ALTER TABLE ' + TABLE_SCHEMA + '.[' + TABLE_NAME + '] DROP CONSTRAINT [' + CONSTRAINT_NAME + ']')
                                    FROM information_schema.table_constraints
                                    WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
                                    exec (@sql)
                                    PRINT @sql
                                end
                                while(exists(select 1 from INFORMATION_SCHEMA.TABLES ))
                                begin
                                    declare @sql2 nvarchar(2000)
                                    SELECT TOP 1 @sql2=('DROP TABLE ' + TABLE_SCHEMA + '.[' + TABLE_NAME + ']')
                                    FROM INFORMATION_SCHEMA.TABLES
                                exec (@sql2)
                                    PRINT @sql2
                                end");
			}
		}

		private static void BuildIssues(User user, Project project)
		{
			var statuses = BuildStatuses(project);
			var priorities = BuildPriorities(project);

			var repository = _container.Resolve<IIssueRepository>();
			for (var i = 1; i <= NUM_ISSUES; i++)
				repository.Insert(new Issue
				{
					Number = i,
					Name = "name " + i,
					Description = RandomWords(WORDS),
					Owner = user,
					Assignee = user,
					Project = project,
					Priority = priorities.ElementAt(_random.Next(0, priorities.Count())),
					Status = statuses.ElementAt(_random.Next(0, priorities.Count())),
					Opened = GetRandomDate().Value,
					Closed = GetRandomDate(true)
				});
		}

		private static DateTime? GetRandomDate(bool canBeNull = false)
		{
			if (canBeNull && _random.Next(0, 3) == 0)
				return null;

			return new DateTime(2013, _random.Next(1, 12), _random.Next(1, 28));
		}

		private static string RandomWords(string text)
		{
			var words = text.Split(' ');
			var result = words.Aggregate("", (current, t) => current + (" " + words[_random.Next(0, words.Length - 1)]));
			result = result.Substring(1).ToLower();
			return result[1].ToString().ToUpper() + result.Substring(2);
		}

		private static IEnumerable<Status> BuildStatuses(Project project)
		{
			var order = 1;
			var list = new List<Status>();
			list.Add(new Status { Name = "Pending", Order = order++, Project = project });
			list.Add(new Status { Name = "In Development", Order = order++, Project = project });
			list.Add(new Status { Name = "Ready to Test", Order = order++, Project = project });
			list.Add(new Status { Name = "In Testing", Order = order++, Project = project });
			list.Add(new Status { Name = "Failed Testing", Order = order++, Project = project });
			list.Add(new Status { Name = "Complete", Order = order, Project = project });

			var repository = _container.Resolve<IStatusRepository>();
			foreach (var status in list)
				repository.Insert(status);

			return list;
		}

		private static IEnumerable<Priority> BuildPriorities(Project project)
		{
			var order = 1;
			var list = new List<Priority>();
			list.Add(new Priority { Name = "Low", Order = order++, Project = project });
			list.Add(new Priority { Name = "Medium", Order = order++, Project = project });
			list.Add(new Priority { Name = "High", Order = order++, Project = project });
			list.Add(new Priority { Name = "Critical", Order = order, Project = project });

			var repository = _container.Resolve<IPriorityRepository>();
			foreach (var priority in list)
				repository.Insert(priority);

			return list;
		}
	}
}
