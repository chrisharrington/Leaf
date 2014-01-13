using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using IssueTracker.Common.Models;

namespace IssueTracker.Data
{
	public interface IDataContext
	{
		DbSet<Issue> Issues { get; set; }
		DbSet<Priority> Priorities { get; set; }
		DbSet<Status> Statuses { get; set; }
		DbSet<ApplicationUser> Users { get; set; }
		int SaveChanges();
		DbEntityEntry Entry(object model);
	}
}