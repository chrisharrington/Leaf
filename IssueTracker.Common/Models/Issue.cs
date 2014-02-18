using System;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
    public class Issue : ProjectModel
    {
		public int Number { get;set; }
		public string Comments { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
		public DateTime Updated { get; set; }

		public virtual User Tester { get; set; }
		public virtual User Developer { get; set; }
		public virtual Priority Priority { get; set; }
		public virtual Status Status { get; set; }
		public Milestone Milestone { get; set; }
		public User UpdatedBy { get; set; }
    }
}
