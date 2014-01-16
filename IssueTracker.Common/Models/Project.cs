using System.Collections.Generic;

namespace IssueTracker.Common.Models
{
	public class Project : BaseModel
	{
		public IEnumerable<User> Users { get; set; }
	}
}