using System.Data.Entity;
using IssueTracker.Common.Models;

namespace IssueTracker.Data
{
	public class Context : DbContext, IDataContext
	{
		public DbSet<Issue> Issues { get; set; }
		public DbSet<Priority> Priorities { get; set; }
		public DbSet<Status> Statuses { get; set; }
		public DbSet<ApplicationUser> Users { get; set; }

		public Context() : base("DefaultDataConnection") {}
	}
}