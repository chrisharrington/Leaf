using System.Data.Entity;
using IssueTracker.Common.Models;

namespace IssueTracker.Data
{
	public class DataContext : DbContext
	{
		public DbSet<Issue> Issues { get; set; }
		public DbSet<Priority> Priorities { get; set; }
		public DbSet<Status> Statuses { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Project> Projects { get; set; }

		public DataContext() : base("DefaultDataConnection") {}
	}
}