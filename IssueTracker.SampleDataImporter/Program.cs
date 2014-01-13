using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Autofac;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.SampleDataImporter
{
	public class Program
	{
		const int NUM_ISSUES = 150;

		private static Random _random;
		private static IContainer _container;

		public static void Main(string[] args)
		{
			_random = new Random();
			_container = Dependencies.Dependencies.Register().Build();

			RemoveData();
			BuildIssues();
		}

		private static void RemoveData()
		{
			if (!ConfigurationManager.ConnectionStrings["DefaultDataConnection"].ConnectionString.Contains("Database=Development"))
				throw new Exception("Production database!");

			var issueRepository = _container.Resolve<IIssueRepository>();
			foreach (var issue in issueRepository.All())
				issueRepository.Delete(issue);

			var userRepository = _container.Resolve<IUserRepository>();
			foreach (var user in userRepository.All())
				userRepository.Delete(user);

			var priorityRepository = _container.Resolve<IPriorityRepository>();
			foreach (var priority in priorityRepository.All())
				priorityRepository.Delete(priority);

			var statusRepository = _container.Resolve<IStatusRepository>();
			foreach (var status in statusRepository.All())
				statusRepository.Delete(status);
		}

		private static void BuildIssues()
		{
			var statuses = BuildStatuses();
			var priorities = BuildPriorities();
			const string loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
			var owner = new ApplicationUser { EmailAddress = "chrisharrington99@gmail.com", Name = "Chris Harrington" };
			owner.Id = _container.Resolve<IUserRepository>().Insert(owner);

			var repository = _container.Resolve<IIssueRepository>();
			for (var i = 1; i <= NUM_ISSUES; i++)
				repository.Insert(new Issue {
					Number = i,
					Name = "name " + i,
					Description = RandomWords(loremIpsum),
					Owner = owner,
					Assignee = owner,
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

		private static IEnumerable<Status> BuildStatuses()
		{
			var order = 1;
			var list = new List<Status>();
			list.Add(new Status { Name = "Pending", Order = order++ });
			list.Add(new Status { Name = "In Development", Order = order++ });
			list.Add(new Status { Name = "Ready to Test", Order = order++ });
			list.Add(new Status { Name = "In Testing", Order = order++ });
			list.Add(new Status { Name = "Failed Testing", Order = order++ });
			list.Add(new Status { Name = "Complete", Order = order });

			var repository = _container.Resolve<IStatusRepository>();
			foreach (var status in list)
				repository.Insert(status);

			return list;
		}

		private static IEnumerable<Priority> BuildPriorities()
		{
			var order = 1;
			var list = new List<Priority>();
			list.Add(new Priority { Name = "Low", Order = order++ });
			list.Add(new Priority { Name = "Medium", Order = order++ });
			list.Add(new Priority { Name = "High", Order = order++ });
			list.Add(new Priority { Name = "Critical", Order = order });

			var repository = _container.Resolve<IPriorityRepository>();
			foreach (var priority in list)
				repository.Insert(priority);

			return list;
		}
	}
}
