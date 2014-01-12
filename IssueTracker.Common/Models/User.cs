using IssueTracker.Common.Data.Attributes;

namespace IssueTracker.Common.Models
{
	[TableName("ApplicationUsers")]
	public class User : Base
	{
		public string EmailAddress { get; set; }
	}
}