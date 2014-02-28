using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Priority : ProjectModel
	{
		public int Order { get; set; }
		public virtual ICollection<Issue> Issues { get; set; }
	}
}