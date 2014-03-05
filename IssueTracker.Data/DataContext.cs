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
		public DbSet<DateRange> DateRanges { get; set; }
		public DbSet<Milestone> Milestones { get; set; }
		public DbSet<IssueAudit> IssueAudits { get; set; }
		public DbSet<Audit> Audits { get; set; }
		public DbSet<IssueComment> Comments { get; set; }
		public DbSet<IssueType> IssueTypes { get; set; }

		public DataContext() : base("DefaultDataConnection") { }

		protected override void OnModelCreating(DbModelBuilder builder)
		{
			MapMilestones(builder);
			MapPriorities(builder);
			MapStatuses(builder);
			MapUsers(builder);
			MapAudits(builder);
			MapIssues(builder);
			MapProjects(builder);

			base.OnModelCreating(builder); 
		}

		private static void MapMilestones(DbModelBuilder builder)
		{
			var milestone = builder.Entity<Milestone>();
			milestone.Map(x => { x.ToTable("Milestones"); x.MapInheritedProperties(); });
			milestone.HasRequired(x => x.Project).WithMany(x => x.Milestones).WillCascadeOnDelete(false);
		}

		private void MapPriorities(DbModelBuilder builder)
		{
			var priority = builder.Entity<Priority>();
			priority.Map(x => { x.ToTable("Priorities"); x.MapInheritedProperties(); });
			priority.HasRequired(x => x.Project).WithMany(x => x.Priorities).WillCascadeOnDelete(false);
			priority.HasMany(x => x.Issues).WithRequired(x => x.Priority);
		}

		private void MapUsers(DbModelBuilder builder)
		{
			var user = builder.Entity<User>();
			user.Map(x => { x.ToTable("Users"); x.MapInheritedProperties(); });
			user.HasMany(x => x.DeveloperIssues).WithRequired(x => x.Developer);
			user.HasMany(x => x.TesterIssues).WithRequired(x => x.Tester);
		}

		private void MapStatuses(DbModelBuilder builder)
		{
			var status = builder.Entity<Status>();
			status.Map(x => { x.ToTable("Statuses"); x.MapInheritedProperties(); });
			status.HasRequired(x => x.Project).WithMany(x => x.Statuses).WillCascadeOnDelete(false);
			status.HasMany(x => x.Issues).WithRequired(x => x.Status);
		}

		private void MapAudits(DbModelBuilder builder)
		{
			var audit = builder.Entity<Audit>();
			audit.Map(x => { x.ToTable("Audits"); x.MapInheritedProperties(); });
		}

		private void MapIssues(DbModelBuilder builder)
		{
			var type = builder.Entity<IssueType>();
			type.Map(x => { x.ToTable("IssueTypes"); x.MapInheritedProperties(); });
			type.HasMany(x => x.Issues).WithOptional(x => x.Type);

			var comment = builder.Entity<IssueComment>();
			comment.Map(x => { x.ToTable("Comments"); x.MapInheritedProperties(); });
			comment.HasRequired(x => x.Issue).WithMany(x => x.Comments);

			var issueAudit = builder.Entity<IssueAudit>();
			issueAudit.Map(x => { x.ToTable("IssueAudits"); x.MapInheritedProperties(); });
			issueAudit.HasMany(x => x.Changes);
			issueAudit.HasRequired(x => x.Issue).WithMany(x => x.Audits);
			issueAudit.HasRequired(x => x.User);

			var issue = builder.Entity<Issue>();
			issue.Map(x => { x.ToTable("Issues"); x.MapInheritedProperties(); });
			issue.HasMany(x => x.Audits).WithRequired(x => x.Issue);
			issue.HasMany(x => x.Comments).WithRequired(x => x.Issue);
			issue.HasRequired(x => x.Milestone).WithMany(x => x.Issues).WillCascadeOnDelete(false);
			issue.HasRequired(x => x.Priority).WithMany(x => x.Issues).WillCascadeOnDelete(false);
			issue.HasRequired(x => x.Status).WithMany(x => x.Issues).WillCascadeOnDelete(false);
			issue.HasRequired(x => x.Developer).WithMany(x => x.DeveloperIssues).WillCascadeOnDelete(false);
			issue.HasRequired(x => x.Tester).WithMany(x => x.TesterIssues).WillCascadeOnDelete(false);
			issue.HasOptional(x => x.Type).WithMany(x => x.Issues).WillCascadeOnDelete(false);
		}

		private void MapProjects(DbModelBuilder builder)
		{
			var projects = builder.Entity<Project>().ToTable("Projects");
			projects.HasMany(x => x.Statuses).WithOptional();
			projects.HasMany(x => x.Priorities).WithRequired();
		}
	}
}