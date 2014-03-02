using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Audit : NameModel
	{
		public string Property { get; set; }
		public string OldValue { get; set; }
		public string NewValue { get; set; }
	}
}
