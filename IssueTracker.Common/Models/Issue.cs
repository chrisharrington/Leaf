namespace IssueTracker.Common.Models
{
    public class Issue : Base
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public User Owner { get; set; }
		public Priority Priority { get; set; }
		public Status Status { get; set; }
    }
}
