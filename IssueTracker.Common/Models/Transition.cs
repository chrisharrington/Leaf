using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Transition : ProjectModel
	{
		public Status From { get; set; }
		public Status To { get; set; }
	}
}
