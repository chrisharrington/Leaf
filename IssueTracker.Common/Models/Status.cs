namespace IssueTracker.Common.Models
{
	public class Status : ProjectModel
	{
		public int Order { get; set; }
		public int Transition { get; set; }
	}
}