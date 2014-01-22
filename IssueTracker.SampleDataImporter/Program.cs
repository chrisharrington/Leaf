using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using Autofac;
using Dapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;
using IssueTracker.SampleDataImporter.Authorization;
using WebMatrix.WebData;

namespace IssueTracker.SampleDataImporter
{
	public class Program
	{
		private const int NUM_ISSUES = 20;
		private const int NUM_PROJECTS = 1;
		private const string WORDS = "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";

		private static Random _random;
		private static IContainer _container;

		public static void Main(string[] args)
		{
			if (!ConfigurationManager.ConnectionStrings["DefaultDataConnection"].ConnectionString.Contains("Database=Development"))
				throw new Exception("Production database!");

			_random = new Random();
			_container = Dependencies.Dependencies.Register().Build();

			RemoveData();

			var user = InsertAuthorizedUser();
			foreach (var project in BuildProjects(user))
			{
				BuildFilters(user, project);
				BuildIssues(user, project);
			}
		}

		private static void BuildFilters(User user, Project project)
		{
			var myHighPriority = new Filter {Id = Guid.NewGuid(), Name = "My High Priority Issues"};
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
                                declare @tableSchema nvarchar(max)
								declare @tableName nvarchar(max)

								declare tableCursor cursor for select TABLE_SCHEMA, TABLE_NAME from INFORMATION_SCHEMA.TABLES
								open tableCursor

								fetch next from tableCursor into @tableSchema, @tableName

								while @@fetch_status = 0
								begin

									if (@tableName <> '__MigrationHistory')
									begin
										declare @dropSql nvarchar(max)
										set @dropSql = 'truncate table ' + @tableSchema + '.[' + @tableName + ']'
										exec (@dropSql)
									end

									fetch next from tableCursor into @tableSchema, @tableName

								end

								close tableCursor
								deallocate tableCursor");
			}
		}

		private static void BuildIssues(User user, Project project)
		{
			var statuses = BuildStatuses(project).ToArray();
			var priorities = BuildPriorities(project).ToArray();

			var repository = _container.Resolve<IIssueRepository>();
			for (var i = 1; i <= NUM_ISSUES; i++)
				repository.Insert(new Issue
				{
					Number = i,
					Name = RandomWords(WORDS, 8),
					Description = RandomWords(WORDS),
					Tester = user,
					Developer = user,
					Project = project,
					Priority = priorities.ElementAt(_random.Next(0, priorities.Count())),
					Status = statuses.ElementAt(_random.Next(0, priorities.Count())),
					Opened = GetRandomDate().Value,
					Closed = GetRandomDate(true),
					Updated = GetRandomDate().Value,
					UpdatedBy = user
				});
		}

		private static DateTime? GetRandomDate(bool canBeNull = false)
		{
			if (canBeNull && _random.Next(0, 3) == 0)
				return null;

			return new DateTime(2013, _random.Next(1, 12), _random.Next(1, 28));
		}

		private static string RandomWords(string text, int max = int.MaxValue)
		{
			var words = text.Split(' ');
			string result = "";
			if (max == int.MaxValue)
				result = words.Aggregate("", (current, t) => current + (" " + words[_random.Next(0, words.Length - 1)]));
			else
				for (var i = 0; i < max; i++)
					result += " " + words[_random.Next(0, words.Length - 1)];
			result = result.Substring(1).ToLower();
			return result[1].ToString(CultureInfo.InvariantCulture).ToUpper() + result.Substring(2);
		}

		private static IEnumerable<Status> BuildStatuses(Project project)
		{
			var order = 1;
			var pendingDevelopment = new Status { Id = Guid.NewGuid(), Name = "Pending Development", Order = order++, Project = project };
			var inDevelopment = new Status { Id = Guid.NewGuid(), Name = "In Development", Order = order++, Project = project };
			var pendingTesting = new Status { Id = Guid.NewGuid(), Name = "Pending Testing", Order = order++, Project = project };
			var inTesting = new Status { Id = Guid.NewGuid(), Name = "In Testing", Order = order++, Project = project };
			var failedTesting = new Status { Id = Guid.NewGuid(), Name = "Failed Testing", Order = order++, Project = project };
			var complete = new Status { Id = Guid.NewGuid(), Name = "Complete", Order = order, Project = project };

			var statusRepository = _container.Resolve<IStatusRepository>();
			var statuses = new List<Status> { pendingDevelopment, inDevelopment, pendingTesting, inTesting, failedTesting, complete };
			foreach (var status in statuses)
				statusRepository.Insert(status);

			var startDevelopment = new Transition {Project = project, From = pendingDevelopment, To = inDevelopment, Name = "Start Development"};
			var completeDevelopment = new Transition {Project = project, From = inDevelopment, To = pendingTesting, Name = "Complete Development"};
			var startTesting = new Transition {Project = project, From = pendingTesting, To = inTesting, Name = "Start Testing"};
			var failTesting = new Transition {Project = project, From = inTesting, To = failedTesting, Name = "Fail Testing"};
			var restartDevelopment = new Transition {Project = project, From = failedTesting, To = inDevelopment, Name = "Restart Development"};
			var passTesting = new Transition {Project = project, From = inTesting, To = complete, Name = "Pass Testing"};

			var transitionRepository = _container.Resolve<ITransitionRepository>();
			new List<Transition> {startDevelopment, completeDevelopment, startTesting, failTesting, restartDevelopment, passTesting}.ForEach(x => transitionRepository.Insert(x));

			return statuses;
		}

		private static IEnumerable<Priority> BuildPriorities(Project project)
		{
			var order = 1;
			var list = new List<Priority> {
				new Priority {Name = "Low", Order = order++, Project = project},
				new Priority {Name = "Medium", Order = order++, Project = project},
				new Priority {Name = "High", Order = order++, Project = project},
				new Priority {Name = "Critical", Order = order, Project = project}
			};

			var repository = _container.Resolve<IPriorityRepository>();
			foreach (var priority in list)
				repository.Insert(priority);

			return list;
		}
	}
}
