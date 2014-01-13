using System;

namespace IssueTracker.Common.Models
{
    public class Issue : Base
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public ApplicationUser Owner { get; set; }
		public ApplicationUser Assignee { get; set; }
		public Priority Priority { get; set; }
		public Status Status { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
    }
}
