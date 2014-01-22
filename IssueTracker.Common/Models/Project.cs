using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Project : BaseModel
	{
		public ICollection<User> Users { get; set; }
		public ICollection<Priority> Priorities { get; set; }
		public ICollection<Status> Statuses { get; set; } 
	}
}