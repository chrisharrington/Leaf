using IssueTracker.Common.Models;

namespace IssueTracker.Common.ViewModels
{
	public class Search
	{
		public int start { get; set; }
		public int end { get; set; }
		public Project project { get; set; }
		public Priority priority { get; set; }
		public Status status { get; set; }
		public User developer { get; set; }
		public User tester { get; set; }
		public string filter { get; set; }
	}
}
