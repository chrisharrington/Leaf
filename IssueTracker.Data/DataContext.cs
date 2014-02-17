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
		public DbSet<Transition> Transitions { get; set; }
		public DbSet<Filter> Filters { get; set; }
		public DbSet<DateRange> DateRanges { get; set; }
		public DbSet<Milestone> Milestones { get; set; }

		public DataContext() : base("DefaultDataConnection") { }

		protected override void OnModelCreating(DbModelBuilder builder)
		{
			builder.Entity<User>().Map(x => { x.ToTable("Users"); x.MapInheritedProperties(); });
			builder.Entity<Status>().Map(x => { x.ToTable("Statuses"); x.MapInheritedProperties(); }).HasRequired(x => x.Project).WithMany(x => x.Statuses).WillCascadeOnDelete(false);
			builder.Entity<Priority>().Map(x => { x.ToTable("Priorities"); x.MapInheritedProperties(); }).HasRequired(x => x.Project).WithMany(x => x.Priorities).WillCascadeOnDelete(false);
			builder.Entity<Filter>().Map(x => { x.ToTable("Filters"); x.MapInheritedProperties(); });
			
			MapProjects(builder);

			base.OnModelCreating(builder); 
		}

		private void MapProjects(DbModelBuilder builder)
		{
			var projects = builder.Entity<Project>().ToTable("Projects");
			projects.HasMany(x => x.Statuses).WithOptional();
			projects.HasMany(x => x.Priorities).WithRequired();
		}
	}
}