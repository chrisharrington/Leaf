using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Filter : ProjectModel
	{
		public Status Status { get; set; }
		public Priority Priority { get; set; }
		public User Developer { get; set; }
		public User Tester { get; set; }
		public string Text { get; set; }
		public DateRange OpenedBetween { get; set; }
		public DateRange ClosedBetween { get; set; }
	}
}
