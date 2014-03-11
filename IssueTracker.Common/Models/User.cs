using System;
using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class User : ProjectModel
	{
		public string EmailAddress { get; set; }
		public bool IsActivated { get; set; }
		public Guid ActivationId { get; set; }
		public virtual ICollection<Issue> DeveloperIssues { get; set; }
		public virtual ICollection<Issue> TesterIssues { get; set; }
	}
}