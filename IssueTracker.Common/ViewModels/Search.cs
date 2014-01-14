using IssueTracker.Common.Models;

namespace IssueTracker.Common.ViewModels
{
	public class Search
	{
		public int start { get; set; }
		public int end { get; set; }
		public Priority priority { get; set; }
		public Status status { get; set; }
		public ApplicationUser assignee { get; set; }
		public ApplicationUser owner { get; set; }
		public string filter { get; set; }
	}
}
