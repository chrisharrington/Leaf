using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class FilterUser : FilterModel
	{
		public User User { get; set; }
	}
}