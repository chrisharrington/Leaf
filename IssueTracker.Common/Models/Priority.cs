using IssueTracker.Common.Data.Attributes;

namespace IssueTracker.Common.Models
{
	[TableName("Priorities")]
	public class Priority : Base
	{
		public int Order { get; set; }
	}
}