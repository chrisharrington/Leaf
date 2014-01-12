using IssueTracker.Common.Data.Attributes;

namespace IssueTracker.Common.Models
{
	[TableName("Statuses")]
	public class Status : Base
	{
		public int Order { get; set; }
	}
}