using System.Collections.Generic;

namespace IssueTracker.Common.Models
{
	public class User : BaseModel
	{
		public string EmailAddress { get; set; }
		public IEnumerable<Project> Projects { get; set; }
	}
}