using System;

namespace IssueTracker.Common.Models
{
    public class Issue : ProjectModel
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public User Owner { get; set; }
		public User Assignee { get; set; }
		public Priority Priority { get; set; }
		public Status Status { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
    }
}
