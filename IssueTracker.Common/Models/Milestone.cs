using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Milestone : ProjectModel
	{
		public virtual ICollection<Issue> Issues { get; set; }
	}
}