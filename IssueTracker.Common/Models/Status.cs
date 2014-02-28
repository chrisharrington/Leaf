using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Status : ProjectModel
	{
		public int Order { get; set; }
		public virtual ICollection<Issue> Issues { get; set; }
	}
}