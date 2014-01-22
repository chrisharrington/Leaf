using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class FilterPriority : FilterModel
	{
		public Priority Priority { get; set; }
	}
}