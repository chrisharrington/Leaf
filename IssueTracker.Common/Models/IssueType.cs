using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class IssueType : NameModel
	{
		public ICollection<Issue> Issues { get; set; }

		public IssueType()
		{
			Issues = new List<Issue>();
		}
	}
}