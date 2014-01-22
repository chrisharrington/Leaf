using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class FilterStatus : FilterModel
	{
		public Status Status { get; set; }
	}
}