using System;

namespace IssueTracker.Common.ViewModels
{
	public class UserViewModel
	{
		public Guid id { get; set; }
		public string name { get; set; }
		public string emailAddress { get; set; }
		public bool isActivated { get; set; }
		public int developerIssueCount { get; set; }
		public int testerIssueCount { get; set; }
	}
}