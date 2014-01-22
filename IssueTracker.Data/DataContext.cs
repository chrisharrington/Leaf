using System;
using System.Data.Entity;
using System.Linq.Expressions;
using IssueTracker.Common.Models;
using IssueTracker.Common.Models.Base;

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
		public DbSet<FilterStatus> FilterStatuses { get; set; }

		public DataContext() : base("DefaultDataConnection") { }

		protected override void OnModelCreating(DbModelBuilder builder)
		{
			builder.Entity<User>()
				.Map(x => { x.ToTable("Users"); x.MapInheritedProperties(); });

			builder.Entity<Status>()
				.Map(x => { x.ToTable("Statuses"); x.MapInheritedProperties(); })
				.HasRequired(x => x.Project)
				.WithMany(x => x.Statuses);

			builder.Entity<Priority>()
				.Map(x => { x.ToTable("Priorities"); x.MapInheritedProperties(); })
				.HasRequired(x => x.Project)
				.WithMany(x => x.Priorities);

			MapFilters(builder);
			MapProjects(builder);

			base.OnModelCreating(builder); 
		}

		private void MapFilters(DbModelBuilder builder)
		{
			MapFilterTable<FilterStatus>(builder, "FilterStatuses", x => x.Status);
			MapFilterTable<FilterPriority>(builder, "FilterPriorities", x => x.Priority);
			MapFilterTable<FilterUser>(builder, "FilterUsers", x => x.User);

			var filters = builder.Entity<Filter>().Map(x => { x.ToTable("Filters"); x.MapInheritedProperties(); });
			filters.HasRequired(x => x.Project);
			filters.HasMany(x => x.Statuses).WithOptional();
		}

		private void MapFilterTable<FilterTable>(DbModelBuilder builder, string tableName, Expression<Func<FilterTable, object>> required) where FilterTable : FilterModel
		{
			var model = builder.Entity<FilterTable>().ToTable(tableName);
			model.HasRequired(x => x.Filter);
			model.HasRequired(required);
		}

		private void MapProjects(DbModelBuilder builder)
		{
			var projects = builder.Entity<Project>().ToTable("Projects");
			projects.HasMany(x => x.Statuses).WithOptional();
			projects.HasMany(x => x.Priorities).WithRequired();
		}
	}
}