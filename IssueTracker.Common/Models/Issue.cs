using System;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
    public class Issue : ProjectModel
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public string Comments { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
		public DateTime Updated { get; set; }

		public User Tester { get; set; }
		public User Developer { get; set; }
		public Priority Priority { get; set; }
		public Status Status { get; set; }
		public Milestone Milestone { get; set; }
		public User UpdatedBy { get; set; }
    }
}
