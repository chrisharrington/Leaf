using System;

namespace IssueTracker.Common.Models
{
    public class Issue : ProjectModel
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
		public DateTime Updated { get; set; }

		public virtual User Owner { get; set; }
		public virtual User Assignee { get; set; }
		public virtual Priority Priority { get; set; }
		public virtual Status Status { get; set; }
		public User UpdatedBy { get; set; }
    }
}
