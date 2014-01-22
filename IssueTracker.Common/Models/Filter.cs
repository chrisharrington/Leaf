using System;

namespace IssueTracker.Common.Models
{
	public class Filter : ProjectModel
	{
		public Priority Priority { get; set; }
		public Status Status { get; set; }
		public User Developer { get; set; }
		public User Tester { get; set; }
		public string Text { get; set; }
		public DateTime? OpenStart { get; set; }
		public DateTime? OpenEnd { get; set; }
		public DateTime? CloseStart { get; set; }
		public DateTime? CloseEnd { get; set; }
	}
}
